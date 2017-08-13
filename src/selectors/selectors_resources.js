import { createSelector } from 'reselect';


export const getResourceInfos = (state, props) =>
  state.devices.active.resources[`${props.oid}${props.iid}${props.rid}`];

export const getResValue = (state, props) =>
  state.devices.active.res_values[`${props.oid}${props.iid}${props.rid}`];


export const getDeviceResources = createSelector (
  (state) => state.devices.active.resources,
  (resources) => resources
);