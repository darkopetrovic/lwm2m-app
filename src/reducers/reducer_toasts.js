
import {ADD_TOAST} from '../actions/actions_toast';

const initState = {
    toast: {}
};

export default function(state = initState, action) {

    let new_toast;

    switch (action.type) {

        case 'DEVICE_REGISTRATION':

            const device = action.data;

            new_toast = {
                title: 'New device registration',
                message: `Endpoint name: ${device.name} ID: ${device.id}`
            };

            return {...state, toast: new_toast};

        case ADD_TOAST:
            new_toast = action.payload;
            return {...state, new_toast};
        default:
            return state;

    }


}