import _ from "lodash";
import { FETCH_RESOURCES, FETCH_RESOURCE, DELETE_RESOURCE } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case DELETE_RESOURCE:
      return _.omit(state, action.payload);
    case FETCH_RESOURCE:
      return { ...state, [action.payload.data.resource.id]: action.payload.data.resource };
    case FETCH_RESOURCES:
      return _.mapKeys(action.payload.data.resources, "id");

    default:
      return state;
  }
}
