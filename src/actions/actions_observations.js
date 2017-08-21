import axios from 'axios';

import config from '../config';
const ROOT_URL = config.API_URL;

export const FETCH_DEVICE_OBSERVATIONS  = "FETCH_DEVICE_OBSERVATIONS";

export function fetchDeviceObservations(did) {
    const request = axios.get(`${ROOT_URL}/observations/${did}`);

    return {
        type: FETCH_DEVICE_OBSERVATIONS,
        payload: request
    };
}
