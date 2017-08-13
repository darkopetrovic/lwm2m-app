import _ from 'lodash';
import { createSelector } from 'reselect'


export const getSelectedObject = createSelector(
  state => state.objects.list,
  state => state.objects.selectedObject,
  (objects, selected_object) => _.find(objects, {id: selected_object})
);

export const getOwners = createSelector(
  state => state.objects.owners,
  (owners) => owners
);
