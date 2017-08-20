import _ from "lodash";
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import {FETCH_ACTIONS, ADD_ACTION, DELETE_ACTION, UPDATE_ACTION} from "../actions/actions_actions";
import dotProp from 'dot-prop-immutable';

const initState = {
    list: {},
    isFetching: false,
    selected: null
};


export default function(state = initState, action) {

    let actionId = null;

    switch (action.type) {

        case `${FETCH_ACTIONS}_${PENDING}`:
            return {...state, isFetching: true};

        case `${FETCH_ACTIONS}_${FULFILLED}`:
            return {...state,
                list: _.mapKeys(action.payload.data.actions, "id"),
                isFetching: false
            };

        case `${ADD_ACTION}_${FULFILLED}`:
            return dotProp.set(state, `list`,
                list => ({...list, [action.payload.data.action.id]: action.payload.data.action}) );

        case `${DELETE_ACTION}_${FULFILLED}`:
            actionId = action.payload.data.action.id;
            return dotProp.delete(state, `list.${actionId}`);

        case `${UPDATE_ACTION}_${FULFILLED}`:
            actionId = action.payload.data.action.id;
            return dotProp.merge(state, `list.${actionId}`, {...action.payload.data.action});

        case 'SELECT_ACTION':
            return {...state, 'selected': action.payload};

        default:
            return state;
    }
}
