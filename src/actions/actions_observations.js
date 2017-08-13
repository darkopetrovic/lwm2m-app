import axios from 'axios';

const ROOT_URL = "http://localhost:5000/api";

export const FETCH_DEVICE_OBSERVATIONS  = "FETCH_DEVICE_OBSERVATIONS";

export function fetchDeviceObservations(did) {
    const request = axios.get(`${ROOT_URL}/observations/${did}`);

    return {
        type: FETCH_DEVICE_OBSERVATIONS,
        payload: request
    };
}
