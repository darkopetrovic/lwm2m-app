import axios from 'axios';

const ROOT_URL = "http://localhost:5000/api";

export const FETCH_OBJECTS  = "FETCH_OBJECTS";
export const FETCH_OBJECT   = "FETCH_OBJECT";
export const DELETE_OBJECT  = "DELETE_OBJECT";

export const FETCH_RESOURCES    = "FETCH_RESOURCES";
export const FETCH_RESOURCE    = "FETCH_RESOURCE";
export const DELETE_RESOURCE   = "DELETE_RESOURCE";

export const SELECT_OBJECT   = "SELECT_OBJECT";

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