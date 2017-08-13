import axios from 'axios';

const ROOT_URL = "http://localhost:5000/api";

export const FETCH_OWNERS  = "FETCH_OWNERS";
export const FETCH_OWNER   = "FETCH_OWNER";
export const DELETE_OWNER  = "DELETE_OWNER";

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