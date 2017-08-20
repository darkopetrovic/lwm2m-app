import _ from 'lodash';
import { createSelector } from 'reselect';


export const getDeviceObservations = createSelector (
  (state) => state.devices.observations && state.devices.observations.list,
  (state) => state.devices.active.id,
  (observations, did) => _.filter(observations, {did})
);