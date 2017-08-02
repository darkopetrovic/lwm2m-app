import _ from "lodash";
import { FETCH_DEVICES, FETCH_DEVICE, DELETE_DEVICE, GET_RESOURCE_VALUE } from "../actions";
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import update from 'immutability-helper';

const initState = {
  list: {},
  active: null
};

export default function(state = initState, action) {

    console.log(action);

    switch (action.type) {

        case DELETE_DEVICE:
            return _.omit(state, action.payload);

        case `${FETCH_DEVICE}_${FULFILLED}`:
            return { ...state, active: action.payload.data.device };

        case `${FETCH_DEVICES}_${FULFILLED}`:
            return {...state, list: _.mapKeys(action.payload.data.devices, "id")} ;

        case 'DEVICE_REGISTRATION':
            return { ...state, list: { ...state.list, [action.data.id]: action.data } };


        case `${GET_RESOURCE_VALUE}_${FULFILLED}`:

            const res = action.payload.data.response;
            const device = state.active;

            const oidx = _.findIndex(device.objects, {id: parseInt(res.oid)});
            const iidx = _.findIndex(device.objects[oidx].instances, {id: parseInt(res.iid)});
            const ridx = _.findIndex(device.objects[oidx].instances[iidx].resources, {id: res.rid});

            const newObj = update(state.active, {
                objects: {
                    [oidx]: {
                        instances: {
                            [iidx] : {
                                resources : {
                                    [ridx]: {
                                        value: {
                                            $set: res.value
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return { ...state, active : newObj };


        default:
            return state;
    }
}



