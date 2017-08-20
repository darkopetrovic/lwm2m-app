import _ from 'lodash';
import { createSelector } from 'reselect';



export const getSelectedOwner = createSelector(
  state => state.owners.list,
  state => state.owners.selected,
  (owners, selected) => owners[selected]
);