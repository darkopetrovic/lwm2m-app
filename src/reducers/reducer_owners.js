import _ from "lodash";
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import {
    FETCH_OWNERS, ADD_OWNER, DELETE_OWNER, UPDATE_OWNER,
    SELECT_OWNER
} from "../actions/actions_owners";
import dotProp from 'dot-prop-immutable';

const initState = {
    list: {},
    isFetching: false,
    selected: null
};


export default function(state = initState, action) {

    let ownerId = null;

    switch (action.type) {

        case `${FETCH_OWNERS}_${PENDING}`:
            return {...state, isFetching: true};

        case `${FETCH_OWNERS}_${FULFILLED}`:
            return {...state,
                list: _.mapKeys(action.payload.data.owners, "id"),
                isFetching: false
            };

        case SELECT_OWNER:
            return {...state, selected: action.payload};

        case `${ADD_OWNER}_${FULFILLED}`:
            return dotProp.set(state, `list`,
                list => ({...list, [action.payload.data.owner.id]: action.payload.data.owner}) );

        case `${DELETE_OWNER}_${FULFILLED}`:
            ownerId = action.payload.data.owner.id;
            return dotProp.delete(state, `list.${ownerId}`);

        case `${UPDATE_OWNER}_${FULFILLED}`:
            ownerId = action.payload.data.owner.id;
            return dotProp.merge(state, `list.${ownerId}`, {...action.payload.data.owner});

        default:
            return state;
    }
}
