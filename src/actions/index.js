import axios from 'axios';

import fake_device from './fake_devices.json';


export const FETCH_DEVICES  = "FETCH_DEVICES";
export const FETCH_DEVICE   = "FETCH_DEVICE";
export const DELETE_DEVICE  = "DELETE_DEVICE";
export const GET_RESOURCE_VALUE  = "GET_RESOURCE_VALUE";
export const WRITE_RESOURCE_VALUE  = "WRITE_RESOURCE_VALUE";
export const OBSERVE_RESOURCE_VALUE  = "OBSERVE_RESOURCE_VALUE";
export const CANCEL_OBSERVE_RESOURCE  = "CANCEL_OBSERVE_RESOURCE";
export const DISCOVER_OBJECT_RESOURCES  = "DISCOVER_OBJECT_RESOURCES";

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

export function readResourceValue(did, oid, iid, rid) {
    const request = axios.get(`${ROOT_URL}/read/${did}/${oid}/${iid}/${rid}`);

    return {
        type: GET_RESOURCE_VALUE,
        payload: {
            promise: request,
            data: {did, oid, iid, rid}
        }
    };
}

export function observeResourceValue(did, oid, iid, rid) {
    const request = axios.get(`${ROOT_URL}/observe/${did}/${oid}/${iid}/${rid}`);

    return {
        type: OBSERVE_RESOURCE_VALUE,
        payload: {
            promise: request,
            data: {did, oid, iid, rid}
        }
    };
}

export function cancelObserveResource(did, oid, iid, rid) {
    const request = axios.delete(`${ROOT_URL}/observe/${did}/${oid}/${iid}/${rid}`);

    return {
        type: CANCEL_OBSERVE_RESOURCE,
        payload: {
            promise: request,
            data: {did, oid, iid, rid}
        }
    };
}

export function writeResourceValue(did, oid, iid, rid, data) {
    const request = axios.post(`${ROOT_URL}/write/${did}/${oid}/${iid}/${rid}`, {
        value: data
    });

    return {
        type: WRITE_RESOURCE_VALUE,
        payload: {
            promise: request,
            data: {did, oid, iid, rid}
        }
    };
}

export function discoverObjectResource(did, oid, iid) {
    const request = axios.get(`${ROOT_URL}/discover/${did}/${oid}/${iid}`);

    return {
        type: DISCOVER_OBJECT_RESOURCES,
        payload: {
            promise: request,
            data: {did, oid, iid}
        }
    };
}


