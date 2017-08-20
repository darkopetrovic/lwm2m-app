import _ from 'lodash';
import { createSelector } from 'reselect';

export const getResource = (state, props) =>
  state.resources.list[`${props.resource_key}`];


export const getResourceInfos = (state, props) =>
  state.devices.active && state.devices.active.resources[`${props.oid}_${props.iid}_${props.rid}`];

export const getResValue = (state, props) =>
  state.devices.active && state.devices.active.res_values[`${props.oid}_${props.iid}_${props.rid}`];


export const getDeviceResources = createSelector (
  (state) => state.devices.active.resources,
  (resources) => resources
);

export const getSelectedResource = createSelector(
  state => state.resources.list,
  state => state.resources.selected,
  (resources, selected) => resources[selected]
);