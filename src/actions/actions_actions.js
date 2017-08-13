import axios from 'axios';

export const FETCH_ACTIONS  = "FETCH_ACTIONS";
export const ADD_ACTION  = "ADD_ACTION";
export const DELETE_ACTION  = "DELETE_ACTION";
export const UPDATE_ACTION  = "UPDATE_ACTION";

const ROOT_URL = "http://localhost:5000/api";

export function fetchActions() {
    const request = axios.get(`${ROOT_URL}/actions`);

    return {
        type: FETCH_ACTIONS,
        payload: request
    };
}


export function addAction(data) {
    const request = axios.post(`${ROOT_URL}/actions`, {
        ...data
    });

    return {
        type: ADD_ACTION,
        payload: request
    };
}

export function updateAction(id, data) {
    const request = axios.post(`${ROOT_URL}/actions/${id}`, {
      ...data
    });

    return {
        type: UPDATE_ACTION,
        payload: request
    };
}



export function deleteAction(id) {
    const request = axios.delete(`${ROOT_URL}/actions/${id}`);

    return {
        type: DELETE_ACTION,
        payload: request
    };
}


