import axios from 'axios';

import config from '../config';
const ROOT_URL = config.API_URL;

export const FETCH_DEVICE_MODELS  = "FETCH_DEVICE_MODELS";
export const FETCH_DEVICE_MODEL  = "FETCH_DEVICE_MODEL";
export const ADD_DEVICE_AS_A_MODEL  = "ADD_DEVICE_AS_A_MODEL";
export const ADD_DEVICE_MODEL  = "ADD_DEVICE_MODEL";
export const DELETE_DEVICE_MODEL  = "DELETE_DEVICE_MODEL";
export const UPDATE_DEVICE_MODEL  = "UPDATE_DEVICE_MODEL";
export const SELECT_DEVICE_MODEL  = "SELECT_DEVICE_MODEL";


export function fetchDeviceModels() {
    const request = axios.get(`${ROOT_URL}/devicemodels`);

    return {
        type: FETCH_DEVICE_MODELS,
        payload: request
    };
}

export function updateDeviceModel(id, data) {
    const request = axios.post(`${ROOT_URL}/devicemodels/${id}`, {
        ...data
    });

    return {
        type: UPDATE_DEVICE_MODEL,
        payload: request
    };
}



export function deleteDeviceModel(id) {
    const request = axios.delete(`${ROOT_URL}/devicemodels/${id}`);

    return {
        type: DELETE_DEVICE_MODEL,
        payload: request
    };
}


export function addAsAModel(did) {
    const request = axios.post(`${ROOT_URL}/devicemodels`, {
        deviceId: did
    });

     return {
        type: ADD_DEVICE_AS_A_MODEL,
        payload: request
    };
}


