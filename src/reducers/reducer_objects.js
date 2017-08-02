import _ from "lodash";
import { FETCH_OBJECTS, FETCH_OBJECT, DELETE_OBJECT } from "../actions";
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

export default function(state = {}, action) {
    switch (action.type) {

        case DELETE_OBJECT:
            return _.omit(state, action.payload);

        case `${FETCH_OBJECT}_${FULFILLED}`:
            return { ...state, [action.payload.data.object.id]: action.payload.data.object };

        case FETCH_OBJECTS + "_" + FULFILLED:
            return _.mapKeys(action.payload.data.objects, "id");

        default:
            return state;
    }
}
