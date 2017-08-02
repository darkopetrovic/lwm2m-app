import { combineReducers } from "redux";
//import { routerReducer } from "react-router-redux";
//import { reducer as formReducer } from "redux-form";
import DevicesReducer from './reducer_devices';
import ObjectsReducer from './reducer_objects';
import ResourcesReducer from './reducer_resources';

// main reducers
const reducers = combineReducers({
    devices: DevicesReducer,
    objects: ObjectsReducer,
    resources: ResourcesReducer
});

export default reducers;