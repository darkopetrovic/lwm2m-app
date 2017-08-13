import _ from "lodash";
import {
    FETCH_OBJECTS, FETCH_OBJECT, DELETE_OBJECT, SELECT_OBJECT
} from "../actions/actions_objectdb";
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import { LOCATION_CHANGE } from 'react-router-redux';
import {FETCH_OWNERS} from "../actions/actions_owners";

const initState = {
    list: {},
    isFetching: false,
    selectedObject: null,
    owners: {}
};


export default function(state = initState, action) {

    switch (action.type) {

        case DELETE_OBJECT:
            return _.omit(state, action.payload);

        case `${FETCH_OBJECT}_${FULFILLED}`:
            return { ...state, [action.payload.data.object.id]: action.payload.data.object };

        case `${FETCH_OBJECTS}_${PENDING}`:
            return {...state, isFetching: true};

        case `${FETCH_OBJECTS}_${FULFILLED}`:
            return {...state,
                list: _.mapKeys(action.payload.data.objects, "id"),
                isFetching: false
            };

        case `${FETCH_OWNERS}_${FULFILLED}`:
            return {...state,
                owners: _.mapKeys(action.payload.data.owners, "id")
            };

        case SELECT_OBJECT:
            return {...state, selectedObject: action.payload};

        case LOCATION_CHANGE: {
            return {};
        }
        default:
            return state;
    }
}
