import _ from 'lodash';
import { createSelector } from 'reselect'


export const getObject = (state, props) =>
  state.objects.list[`${props.object_key}`];

export const getSelectedObject = createSelector(
  state => state.objects.list,
  state => state.objects.selected,
  (objects, selected) => _.find(objects, {id: selected})
);

export const getOwners = createSelector(
  state => state.objects.owners,
  (owners) => owners
);
