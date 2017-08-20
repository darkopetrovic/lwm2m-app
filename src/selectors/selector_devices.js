

import {createSelector} from "reselect";

export const getActiveDevice = createSelector(
  (state) => state.devices.list,
  (state) => state.devices.active && state.devices.active.id,
  (list, active_id) => list[active_id]
);