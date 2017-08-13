import _ from "lodash";
import { FETCH_RESOURCES, FETCH_RESOURCE, DELETE_RESOURCE } from "../actions/actions_objectdb";
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const initState = {
    list: {},
    isFetching: false
};

export default function(state = initState, action) {
    switch (action.type) {

        case DELETE_RESOURCE:
            return _.omit(state, action.payload);

        case `${FETCH_RESOURCE}_${FULFILLED}`:
            return { ...state, [action.payload.data.resource.id]: action.payload.data.resources };

        case `${FETCH_RESOURCES}_${PENDING}`:
            return {...state, isFetching: true};

        case `${FETCH_RESOURCES}_${FULFILLED}`:
            return {...state,
                list: _.mapKeys(action.payload.data.resources, "id"),
                isFetching: false
            };

        default:
            return state;
    }
}

