import axios from 'axios';

import fake_device from './fake_devices.json';


export const FETCH_DEVICES  = "FETCH_DEVICES";
export const FETCH_DEVICE   = "FETCH_DEVICE";
export const DELETE_DEVICE  = "DELETE_DEVICE";
export const GET_RESOURCE_VALUE  = "GET_RESOURCE_VALUE";

export const FETCH_OBJECTS  = "FETCH_OBJECTS";
export const FETCH_OBJECT   = "FETCH_OBJECT";
export const DELETE_OBJECT  = "DELETE_OBJECT";

export const FETCH_RESOURCES    = "FETCH_RESOURCES";
export const FETCH_RESOURCE    = "FETCH_RESOURCE";
export const DELETE_RESOURCE   = "DELETE_RESOURCE";

const ROOT_URL = "http://localhost:5000/api";

export function fetchDevices() {
    const request = axios.get(`${ROOT_URL}/devices`);

    return {
        type: FETCH_DEVICES,
        payload: request
    };
}

export function fetchDevice(id) {
    const request = axios.get(`${ROOT_URL}/devices/${id}`);

    return {
        type: FETCH_DEVICE,
        payload: request
    };
}

export function deleteDevice(id, callback) {
    /*const request = axios
      .delete(`${ROOT_URL}/devices/${id}`)
      .then(() => callback());*/

    return {
        type: DELETE_DEVICE,
        payload: id
    };
}

export function getResourceValue(did, oid, iid, rid) {
    const request = axios.get(`${ROOT_URL}/read/${did}/${oid}/${iid}/${rid}`);

    return {
        type: GET_RESOURCE_VALUE,
        payload: request
    };
}

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