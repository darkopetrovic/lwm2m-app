import axios from 'axios';

const ROOT_URL = "http://localhost:5000/api";

export const FETCH_OWNERS  = "FETCH_OWNERS";
export const FETCH_OWNER   = "FETCH_OWNER";
export const ADD_OWNER     = "ADD_OWNER";
export const UPDATE_OWNER  = "UPDATE_OWNER";
export const DELETE_OWNER  = "DELETE_OWNER";
export const SELECT_OWNER  = "SELECT_OWNER";

export function fetchOwners() {
    const request = axios.get(`${ROOT_URL}/owners`);

    return {
        type: FETCH_OWNERS,
        payload: request
    };
}

export function fetchOwner(id) {
    const request = axios.get(`${ROOT_URL}/owners/${id}`);

    return {
        type: FETCH_OWNER,
        payload: request
    };
}

export function deleteOwner(id) {
    const request = axios.delete(`${ROOT_URL}/owners/${id}`);

    return {
        type: DELETE_OWNER,
        payload: request
    };
}

export function addOwner(data) {
    const request = axios.post(`${ROOT_URL}/owners`, {
        ...data
    });

    return {
        type: ADD_OWNER,
        payload: request
    };
}

export function updateOwner(id, data) {
    const request = axios.post(`${ROOT_URL}/owners/${id}`, {
        ...data
    });

    return {
        type: UPDATE_OWNER,
        payload: request
    };
}

