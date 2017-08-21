import axios from 'axios';

import config from '../config';
const ROOT_URL = config.API_URL;

export const FETCH_OBJECTS  = "FETCH_OBJECTS";
export const FETCH_OBJECT   = "FETCH_OBJECT";
export const ADD_OBJECT     = "ADD_OBJECT";
export const DELETE_OBJECT  = "DELETE_OBJECT";
export const UPDATE_OBJECT  = "UPDATE_OBJECT";

export const FETCH_RESOURCES   = "FETCH_RESOURCES";
export const FETCH_RESOURCE    = "FETCH_RESOURCE";
export const ADD_RESOURCE      = "ADD_RESOURCE";
export const DELETE_RESOURCE   = "DELETE_RESOURCE";
export const UPDATE_RESOURCE   = "UPDATE_RESOURCE";

export const SELECT_OBJECT   = "SELECT_OBJECT";
export const SELECT_RESOURCE   = "SELECT_RESOURCE";

export function fetchObjects() {
    const request = axios.get(`${ROOT_URL}/objects`);

    return {
        type: FETCH_OBJECTS,
        payload: request
    };
}

export function fetchResources() {
    const request = axios.get(`${ROOT_URL}/resources`);

    return {
        type: FETCH_RESOURCES,
        payload: request
    };
}

export function setSelectedObject(id){
    return {
        type: SELECT_OBJECT,
        payload: id
    }
}

export function addObject(data) {
    const request = axios.post(`${ROOT_URL}/objects`, {
        ...data
    });

    return {
        type: ADD_OBJECT,
        payload: request
    };
}

export function updateObject(id, data) {
    const request = axios.post(`${ROOT_URL}/objects/${id}`, {
        ...data
    });

    return {
        type: UPDATE_OBJECT,
        payload: request
    };
}

export function deleteObject(id) {
    const request = axios.delete(`${ROOT_URL}/objects/${id}`);

    return {
        type: DELETE_OBJECT,
        payload: request
    };
}


export function addResource(data) {
    const request = axios.post(`${ROOT_URL}/resources`, {
        ...data
    });

    return {
        type: ADD_RESOURCE,
        payload: request
    };
}

export function updateResource(id, data) {
    const request = axios.post(`${ROOT_URL}/resources/${id}`, {
        ...data
    });

    return {
        type: UPDATE_RESOURCE,
        payload: request
    };
}

export function deleteResource(eid) {
    const ids = eid.split(',');

    let request;
    if(ids[1]){
        request = axios.delete(`${ROOT_URL}/resources/${ids[0]}/${ids[1]}`);
    } else {
        request = axios.delete(`${ROOT_URL}/resources/${ids[0]}`);
    }

    return {
        type: DELETE_RESOURCE,
        payload: request
    };
}
