import _ from "lodash";
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import { LOCATION_CHANGE } from 'react-router-redux';
import {
    ADD_DEVICE_AS_A_MODEL,
    DELETE_DEVICE_MODEL, FETCH_DEVICE_MODEL,
    FETCH_DEVICE_MODELS, SELECT_DEVICE_MODEL, UPDATE_DEVICE_MODEL
} from "../actions/actions_devicemodels";
import dotProp from 'dot-prop-immutable';

const initState = {
    list: {},
    isFetching: false,
    selectedModel: null
};


export default function(state = initState, action) {

    let deviceModelId = null;

    switch (action.type) {

        case DELETE_DEVICE_MODEL:
            return _.omit(state, action.payload);

        case `${FETCH_DEVICE_MODEL}_${FULFILLED}`:
            return { ...state, [action.payload.data.device_model.id]: action.payload.data.device_model };

        case `${FETCH_DEVICE_MODELS}_${PENDING}`:
            return {...state, isFetching: true};

        case `${FETCH_DEVICE_MODELS}_${FULFILLED}`:
            return {...state,
                list: _.mapKeys(action.payload.data.device_models, "id"),
                isFetching: false
            };

        case `${DELETE_DEVICE_MODEL}_${FULFILLED}`:
            deviceModelId = action.payload.data.device_model.id;
            return dotProp.delete(state, `list.${deviceModelId}`);

        case `${UPDATE_DEVICE_MODEL}_${FULFILLED}`:
            deviceModelId = action.payload.data.device_model.id;
            return dotProp.merge(state, `list.${deviceModelId}`, {...action.payload.data.device_model});

        case SELECT_DEVICE_MODEL:
            return {...state, selectedModel: action.payload};

        case LOCATION_CHANGE: {
            return {};
        }
        default:
            return state;
    }
}
