import _ from "lodash";
import {
    FETCH_OBJECTS, FETCH_OBJECT, DELETE_OBJECT, SELECT_OBJECT, UPDATE_OBJECT, ADD_OBJECT
} from "../actions/actions_objectdb";
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import { LOCATION_CHANGE } from 'react-router-redux';
import {FETCH_OWNERS} from "../actions/actions_owners";
import dotProp from 'dot-prop-immutable';

const initState = {
    list: {},
    isFetching: false,
    selected: null,
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
            return {...state, selected: action.payload};

        case `${ADD_OBJECT}_${FULFILLED}`:
            return dotProp.set(state, `list`,
              list => ({...list, [action.payload.data.object.id]: action.payload.data.object}) );

        case `${UPDATE_OBJECT}_${FULFILLED}`:
            let object = action.payload.data.object;
            return dotProp.merge(state, `list.${object.id}`, {...object});

        case `${DELETE_OBJECT}_${FULFILLED}`:
            return dotProp.delete(state, `list.${action.payload.data.object.id}`);

        case LOCATION_CHANGE: {
            return {};
        }
        default:
            return state;
    }
}
