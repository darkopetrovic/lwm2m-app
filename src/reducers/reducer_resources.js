import _ from "lodash";
import {
    FETCH_RESOURCES, FETCH_RESOURCE, DELETE_RESOURCE,
    SELECT_RESOURCE, UPDATE_RESOURCE, ADD_RESOURCE
} from "../actions/actions_objectdb";
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import dotProp from 'dot-prop-immutable';

const initState = {
    list: {},
    isFetching: false,
    selected: null
};

function createEnhancedId(resource){
    if(resource.specific_object){
        resource.enhanced_id = resource.specific_object.id+','+resource.id;
    } else {
        resource.enhanced_id = resource.id;
    }
}

export default function(state = initState, action) {

    let newState = null;
    let resId = null;
    let resource = null;

    switch (action.type) {

        case DELETE_RESOURCE:
            return _.omit(state, action.payload);

        case `${FETCH_RESOURCE}_${FULFILLED}`:
            return { ...state, [action.payload.data.resource.id]: action.payload.data.resources };

        case `${FETCH_RESOURCES}_${PENDING}`:
            return {...state, isFetching: true};

        case `${FETCH_RESOURCES}_${FULFILLED}`:

            let resources = [];
            _.each(action.payload.data.resources, resource => {
                if(resource.specific_object){
                    resource.enhanced_id = resource.specific_object.id+','+resource.id;
                    resources.push(resource);
                } else {
                    resource.enhanced_id = resource.id;
                    resources.push(resource);
                }
            });
            newState = dotProp.set(state, 'isFetching', false);
            return dotProp.set(newState, 'list', _.mapKeys(resources, "enhanced_id"));

        case `${SELECT_RESOURCE}`:
            return {...state, selected: action.payload};

        case `${ADD_RESOURCE}_${FULFILLED}`:
            resource = action.payload.data.resource;
            createEnhancedId(resource);
            return dotProp.set(state, `list`,
              list => ({...list, [resource.enhanced_id]: resource}) );

        case `${UPDATE_RESOURCE}_${FULFILLED}`:
            resource = action.payload.data.resource;
            createEnhancedId(resource);
            return dotProp.merge(state, `list.${resource.enhanced_id}`, {...resource});

        case `${DELETE_RESOURCE}_${FULFILLED}`:
            let resourceId = action.payload.data.resource;
            createEnhancedId(resourceId);
            return dotProp.delete(state, `list.${resourceId.enhanced_id}`);

        default:
            return state;
    }
}

