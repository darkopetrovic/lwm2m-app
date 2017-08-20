import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as formReducer } from "redux-form";
import DevicesReducer from './reducer_devices';
import ObjectsReducer from './reducer_objects';
import ResourcesReducer from './reducer_resources';
import DeviceModelsReducer from './reducer_devicemodels';
import ActionsReducer from './reducer_actions';
import OwnersReducer from './reducer_owners';
import ToastsReducer from './reducer_toasts';
import LayoutReducer from './reducer_layout';

// main reducers
const reducers = combineReducers({
    routing: routerReducer,
    form: formReducer,
    devices: DevicesReducer,
    objects: ObjectsReducer,
    resources: ResourcesReducer,
    devicemodels: DeviceModelsReducer,
    actions: ActionsReducer,
    owners: OwnersReducer,
    toasts: ToastsReducer,
    layout: LayoutReducer
});

export default reducers;