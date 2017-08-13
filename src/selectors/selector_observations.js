import { createSelector } from 'reselect';


export const getDeviceObservations = createSelector (
  (state) => state.devices.active.observations.list,
  (observations) => observations
);