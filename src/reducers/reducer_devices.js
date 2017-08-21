import _ from "lodash";
import {
    FETCH_DEVICES, FETCH_DEVICE, DELETE_DEVICE, GET_RESOURCE_VALUE,
    WRITE_RESOURCE_VALUE, OBSERVE_RESOURCE_VALUE, CANCEL_OBSERVE_RESOURCE,
    DISCOVER_OBJECT_RESOURCES, READ_OBJECT_RESOURCES, FETCH_QUEUED_REQUESTS
} from "../actions";
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import dotProp from 'dot-prop-immutable';

import {FETCH_DEVICE_OBSERVATIONS} from "../actions/actions_observations";
import {ADD_DEVICE_AS_A_MODEL} from "../actions/actions_devicemodels";


const initState = {
    list: {},
    active: {
        id: null,
        objects_id: [],
        objects: [],
        resources: {},
        res_values: {},
    },
    observations: {},
    queued_req: {}
};


function normlizeDeviceData(dev){

    // These properties are cleared when fetching a Device. That is what is happening here.
    // res_values and observations are handled elsewhere and merged thereafter.
    let device = {
        id: null,
        objects_id: [],
        objects: [],
        resources: {},
        res_values: {},
    };

    device.id = dev.id;

    _.each(dev.objects, object => {
        _.each(object.instances, instance => {
            device.objects_id.push(object.id);

            let obj = {};

            _.each(instance.resources, resource => {
                let res = resource;
                res.instance_id = instance.id;
                res.object_id = object.id;
                device.resources[`${object.id}_${instance.id}_${res.id}`] = res;
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

function addNewObservation(state, did, oid, iid, rid){

    const resId = `${oid}_${iid}_${rid}`;
    // state = dotProp.set(state, `active.res_values.${resId}.isObserved`, true);

    // add the observation in the list
    const id = `${did}:/${oid}/${iid}/${rid}`;
    const newobs = {
        id,
        path: `/${oid}/${iid}/${rid}`,
        did,
        oid,
        iid,
        rid
    };

    return dotProp.set(state, `observations.list`,
      list => ({...list, [id]: newobs})    );
}

function handleDiscoverResponse(oid, iid, resources){
    /* For each resource we receive in the response, create the state for the application
     * by nesting furthermore the Instance and Object ID in the resource.  */
    let resObj = {};
    _.each(resources, resource => {
        let res = resource;
        // add two new properties
        res.instance_id = parseInt(iid);
        res.object_id = parseInt(oid);
        resObj[`${oid}_${iid}_${res.id}`] = res;
    });
    return resObj;
}


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
            newState = dotProp.merge(state, 'active', normDeviceData );

            // if the device is not in the main list, that means the devail details page
            // was reload by the user => we need to put the device in the main list
            newState = dotProp.set(newState, `list.${normDeviceData.id}`, device);

            return newState;



        case `${FETCH_DEVICES}_${FULFILLED}`:
            return {...state, list: _.mapKeys(action.payload.data.devices, "id")} ;

        case `${WRITE_RESOURCE_VALUE}_${PENDING}`:
        case `${OBSERVE_RESOURCE_VALUE}_${PENDING}`:
        case `${GET_RESOURCE_VALUE}_${PENDING}`:
            res = action.payload;
            return dotProp.set(state, `active.res_values.${res.oid}_${res.iid}_${res.rid}.isFetching`, true);

        case `${WRITE_RESOURCE_VALUE}_${FULFILLED}`:
        case `${OBSERVE_RESOURCE_VALUE}_${FULFILLED}`:
        case `${GET_RESOURCE_VALUE}_${FULFILLED}`:
            res = action.payload.data.response;
            resId = `${res.oid}_${res.iid}_${res.rid}`;
            newState = dotProp.set(state, `active.res_values.${resId}.isFetching`, false);
            newState = dotProp.set(newState, `active.res_values.${resId}.error`, res.error);
            newState = dotProp.set(newState, `active.res_values.${resId}.value`, res.value);

            if(action.type === `${OBSERVE_RESOURCE_VALUE}_${FULFILLED}` && !res.error){
                newState = addNewObservation(newState, parseInt(res.did), parseInt(res.oid), parseInt(res.iid), parseInt(res.rid));
            }

            if(res.error && res.error.name === 'REQUEST_IN_QUEUE'){
                let qid = `${res.did}_${res.oid}_${res.iid}_${res.rid}`;
                delete res.error;

                switch(action.type){
                    case `${WRITE_RESOURCE_VALUE}_${FULFILLED}`:
                        res.operation = 'write';
                        qid += '_w';
                        break;
                    case `${OBSERVE_RESOURCE_VALUE}_${FULFILLED}`:
                        res.operation = 'observe';
                        qid += '_o';
                        break;
                    case `${GET_RESOURCE_VALUE}_${FULFILLED}`:
                        res.operation = 'read';
                        qid += '_r';
                        break;
                }

                newState = dotProp.set(newState, `queued_req.${qid}`,
                  {operation: res.operation, did: parseInt(res.did),
                      oid: parseInt(res.oid), iid: parseInt(res.iid), rid: parseInt(res.rid)} );
            }
            return newState;


        case `${READ_OBJECT_RESOURCES}_${FULFILLED}`: {
            const {did, oid, iid, resources, error} = action.payload.data.response;

            newState = state;

            if (error && error.name === 'REQUEST_IN_QUEUE') {
                const qid = `${did}_${oid}_${iid}_r`;
                newState = dotProp.set(newState, `queued_req.${qid}`,
                  {operation: 'read', did: parseInt(did), oid: parseInt(oid), iid: parseInt(iid)});
            }

            return newState
        }

        case `${DISCOVER_OBJECT_RESOURCES}_${FULFILLED}`: {
            const {did, oid, iid, resources, error} = action.payload.data.response;

            if (error && error.name === 'REQUEST_IN_QUEUE') {
                const qid = `${did}_${oid}_${iid}_d`;
                newState = dotProp.set(state, `queued_req.${qid}`,
                  {
                      operation: 'discover',
                      did: parseInt(did),
                      oid: parseInt(oid),
                      iid: parseInt(iid)
                  });
            } else {
                let resObj = handleDiscoverResponse(oid, iid, resources);
                newState = dotProp.merge(state, 'active.resources', resObj);
            }

            return newState;
        }

        case `${CANCEL_OBSERVE_RESOURCE}_${FULFILLED}`:
            res = action.payload.data.response;
            resId = `${res.oid}_${res.iid}_${res.rid}`;
            const obsId = `${res.did}:/${res.oid}/${res.iid}/${res.rid}`;
            // newState = dotProp.set(state, `active.res_values.${resId}.isObserved`, false);
            return dotProp.delete(state, `observations.list.${obsId}`);

        case `${FETCH_DEVICE_OBSERVATIONS}_${PENDING}`:
            return dotProp.set(state, 'observations.isFetching', true);

        case `${FETCH_DEVICE_OBSERVATIONS}_${FULFILLED}`:
            const observations = action.payload.data.observations;
            newState = state;

            _.each(observations, obs => {
                resId = `${obs.oid}_${obs.iid}_${obs.rid}`;
                if(obs.rid){
                    // newState = dotProp.set(newState, `active.res_values.${resId}.isObserved`, true);
                }
            });

            newState = dotProp.set(newState, `observations.isFetching`, false);
            return dotProp.set(newState, 'observations.list', _.mapKeys(observations, "id"));

        case `${FETCH_QUEUED_REQUESTS}_${FULFILLED}`:

            const reqs = _.map(action.payload.data.queued_requests, r => {
                const id = `${r.did}_${r.oid}_${r.iid}${r.rid!==null ? '_'+r.rid : ''}_${r.operation[0]}`;
                return { id, ...r}
            });

            return dotProp.set(state, 'queued_req', _.mapKeys(reqs, "id"));

      // case `${ADD_DEVICE_AS_A_MODEL}_${FULFILLED}`:
      //     return state;

      /********* Action comming from the socket middleware ***********/

      // A new device just registered => update the list of devices with the new device
        case 'DEVICE_REGISTRATION':
            device = _.find(state.list, {name: action.data.name});

            newState = state;

            // when 'device' not null it alredy exists in the main list (based on the endpoint name)
            if(device){
                // remove it from the general list, it will be added with a new ID
                newState = dotProp.delete(newState, `list.${device.id}`);
                // remove it from active if present
                if(state.active && state.active.id === device.id){
                    newState = dotProp.set(newState, `active.id`, null);
                }
            }

            return dotProp.set(newState, `list.${action.data.id}`, action.data);

        case 'UPDATE_REGISTRATION':
            return dotProp.set(state, `list.${action.data.id}`, action.data);

        // Receive the response from a queued resquest => can be any of the lwm2m operations
        case 'QUEUED_REQ_RESPONSE':
            res = action.data;
            resId = `${res.oid}_${res.iid}_${res.rid}`;

            newState = state;

            // handle delayed operation
            if(res.operation === 'read' || res.operation === 'write' || res.operation === 'observe'){

                if(res.operation === 'observe'){
                    newState = addNewObservation(newState, parseInt(res.did), parseInt(res.oid), parseInt(res.iid), parseInt(res.rid));
                }

                // read instance: {"e":[{"n":"5701","sv":"%RH"},{"n":"5603","v":0.00},{"n":"5604","v":100.00},{"n":"5601","v":41.40},{"n":"5602","v":90.00}]}


                // clear queued request in state
                newState = dotProp.delete(newState,
                  `queued_req.${res.did}_${res.oid}_${res.iid}_${res.rid}_${res.operation[0]}`);

                // update the value of the resource
                newState = dotProp.set(newState, `active.res_values.${resId}.error`, res.error);
                return dotProp.set(newState, `active.res_values.${resId}.value`, res.result);
            } else if (res.operation === 'discover'){
                let resObj = handleDiscoverResponse(res.oid, res.iid, res.resources);
                // clear queued request in state
                newState = dotProp.delete(newState, `queued_req.${res.did}_${res.oid}_${res.iid}_d`);
                return dotProp.merge(newState, 'active.resources', resObj);
            } else {
                return state;
            }

        case 'OBSERVATION':
            res = action.data;
            resId = `${res.oid}_${res.iid}_${res.rid}`;
            // update the value of the resource
            return dotProp.set(state, `active.res_values.${resId}.value`, res.value);


        case 'CLEAR_ACTIVE_DEVICE': {
            return dotProp.set(state, `active`, {});
        }

        default:
            return state;
    }
}



