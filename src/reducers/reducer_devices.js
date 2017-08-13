import _ from "lodash";
import {
    FETCH_DEVICES, FETCH_DEVICE, DELETE_DEVICE, GET_RESOURCE_VALUE,
    WRITE_RESOURCE_VALUE, OBSERVE_RESOURCE_VALUE, CANCEL_OBSERVE_RESOURCE, DISCOVER_OBJECT_RESOURCES
} from "../actions";
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import update from 'immutability-helper';
import { normalize, schema  } from 'normalizr';
import dotProp from 'dot-prop-immutable';

import {FETCH_DEVICE_OBSERVATIONS} from "../actions/actions_observations";
import {ADD_DEVICE_AS_A_MODEL} from "../actions/actions_devicemodels";


const initState = {
    list: {},
    active: {
        infos: {},
        objects_id: [],
        objects: [],
        resources: {},
        res_values: {},
        observations: {}
    },
    device: null
};


function normlizeDeviceData(dev){

    // These properties are cleared when fetching a Device. That is what is happening here.
    // res_values and observations are handled elsewhere and merged thereafter.
    let device = {
        infos: {},
        objects_id: [],
        objects: [],
        resources: {}
    };

    device.infos = Object.assign({}, dev);
    delete device.infos.objects;

    _.each(dev.objects, object => {
        _.each(object.instances, instance => {
            device.objects_id.push(object.id);

            let obj = {};

            _.each(instance.resources, resource => {
                let res = resource;
                res.instance_id = instance.id;
                res.object_id = object.id;
                device.resources[`${object.id}${instance.id}${res.id}`] = res;
            });

            obj.id = object.id;
            obj.shortname = object.shortname;
            obj.instance_id = instance.id;
            device.objects.push(obj);
        });

    });
    return device;
}

//
// function setResourcesState(obj, inside) {
//
//     for (let key in obj) {
//         if(inside){
//             obj[key].isFetching = false;
//         }
//         if (obj[key] !== null && typeof obj[key] === "object") {
//             if (key === "resources") {
//                 setResourcesState(obj[key], true);
//             } else {
//                 setResourcesState(obj[key], false);
//             }
//         }
//     }
// }
//
// function updateResourceState(state, prop, oid, iid, rid, value){
//     const ridx = `${oid}${iid}${rid}`;
//     return {
//         ...state,
//         active: {
//             ...state.active,
//             res_values: {
//                 ...state.active.res_values, [ridx]: {
//                     ...state.active.res_values[ridx], [prop]: value
//                 }
//             }
//         }
//     };
// }


export default function(state = initState, action) {
    let device = null;
    let res = null;
    let resId = null;
    let newState = null;

    switch (action.type) {

        case DELETE_DEVICE:
            return _.omit(state, action.payload);

        case `${FETCH_DEVICE}_${FULFILLED}`:
            device = action.payload.data.device;
            const normDeviceData = normlizeDeviceData(device);
            // in case active.res_value and active.observations are already in the state,
            // => we need to merge to not loose these data
            let active_device = _.merge({}, state.active, normDeviceData );
            return dotProp.merge(state, 'active', normDeviceData );

        case `${FETCH_DEVICES}_${FULFILLED}`:
            return {...state, list: _.mapKeys(action.payload.data.devices, "id")} ;

        case `${WRITE_RESOURCE_VALUE}_${PENDING}`:
        case `${OBSERVE_RESOURCE_VALUE}_${PENDING}`:
        case `${GET_RESOURCE_VALUE}_${PENDING}`:
            res = action.payload;
            return dotProp.set(state, `active.res_values.${res.oid}${res.iid}${res.rid}.isFetching`, true);

        case `${WRITE_RESOURCE_VALUE}_${FULFILLED}`:
        case `${OBSERVE_RESOURCE_VALUE}_${FULFILLED}`:
        case `${GET_RESOURCE_VALUE}_${FULFILLED}`:
            res = action.payload.data.response;
            resId = `${res.oid}${res.iid}${res.rid}`;
            newState = dotProp.set(state, `active.res_values.${resId}.isFetching`, false);
            newState = dotProp.set(newState, `active.res_values.${resId}.error`, res.error);
            newState = dotProp.set(newState, `active.res_values.${resId}.value`, res.value);

            if(action.type === `${OBSERVE_RESOURCE_VALUE}_${FULFILLED}` && !res.error){
                newState = dotProp.set(newState, `active.res_values.${resId}.isObserved`, true);

                // add the observation in the list
                const obsId = `${res.did}:/${res.oid}/${res.iid}/${res.rid}`;
                const newobs = {
                    id: obsId,
                    path: `/${res.oid}/${res.iid}/${res.rid}`,
                    did: res.did,
                    oid: res.oid,
                    iid: res.iid,
                    rid: res.rid
                };

                newState = dotProp.set(newState, `active.observations.list`,
                  list => ({...list, [obsId]: newobs})    );
            }

            return newState;

        case `${CANCEL_OBSERVE_RESOURCE}_${FULFILLED}`:
            res = action.payload.data.response;
            resId = `${res.oid}${res.iid}${res.rid}`;
            const obsId = `${res.did}:/${res.oid}/${res.iid}/${res.rid}`;
            newState = dotProp.set(state, `active.res_values.${resId}.isObserved`, false);
            return dotProp.delete(newState, `active.observations.list.${obsId}`);

        case `${FETCH_DEVICE_OBSERVATIONS}_${PENDING}`:
            return dotProp.set(state, 'active.observations.isFetching', true);

        case `${FETCH_DEVICE_OBSERVATIONS}_${FULFILLED}`:
            const observations = action.payload.data.observations;
            newState = state;
            _.each(observations, obs => {
                resId = `${obs.oid}${obs.iid}${obs.rid}`;
                if(obs.rid){
                    newState = dotProp.set(newState, `active.res_values.${resId}.isObserved`, true);
                }
            });

            newState = dotProp.set(newState, `active.observations.isFetching`, false);
            return dotProp.set(newState, 'active.observations.list', _.mapKeys(observations, "id"));

        // case `${DISCOVER_OBJECT_RESOURCES}_${PENDING}`:
        //
        //
        case `${DISCOVER_OBJECT_RESOURCES}_${FULFILLED}`:
            const {oid, iid, resources} = action.payload.data.response;
            /* For each resource we receive in the response, create the state for the application
             * by nesting furthermore the Instance and Object ID in the resource.  */
            let resObj = {};
            _.each(resources, resource => {
                let res = resource;
                // add two new properties
                res.instance_id = parseInt(iid);
                res.object_id = parseInt(oid);
                resObj[`${oid}${iid}${res.id}`] = res;
            });
            return dotProp.merge(state, 'active.resources', resObj);

        // case `${ADD_DEVICE_AS_A_MODEL}_${FULFILLED}`:
        //     return state;

      /********* Action comming from the socket middleware ***********/

      // A new device just registered => update the list of devices with the new device
        case 'DEVICE_REGISTRATION':
            return { ...state, list: { ...state.list, [action.data.id]: action.data } };

      // Receive the response from a queued resquest => can be any of the lwm2m operations
        case 'QUEUED_REQ_RESPONSE':
            res = action.data;
            resId = `${res.oid}${res.iid}${res.rid}`;

            // handle 'read' and 'write' operation
            if(res.operation === 'read' || res.operation === 'write'){
                // update the value of the resource
                newState = dotProp.set(state, `active.res_values.${resId}.error`, res.error);
                return dotProp.set(newState, `active.res_values.${resId}.value`, res.result);
            } else {
                return state;
            }

        default:
            return state;
    }
}



