import _ from 'lodash';
import { createSelector } from 'reselect';

export const getSelectedDeviceModel = createSelector (
  (state) => state.devicemodels.selectedModel,
  (state) => state.devicemodels.list,
  (selected, models) => _.find(models, {id: selected})
);

export const getObjectsFromDeviceModel = createSelector (
  (state) => state.devicemodels.list,
  (state) => state.objects.list,
  (state) => state.resources.list,
  (state, dm) => dm,
  (state, dm, c) => c,
  (state, dm, c, o) => o,
  (state, dm, c, o, i) => i,
  (device_models, objects_list, resources_list, dm, c, o, i) => {

      let objects = [];
      if(dm !== undefined){
          const device_model_objects = device_models[dm] && device_models[dm].objects;

          objects = _.map(device_model_objects, object => {
              return {
                  id: object.id,
                  name: objects_list && objects_list[object.id] && objects_list[object.id].name || '(Unknow)',
                  shortname: objects_list && objects_list[object.id] && objects_list[object.id].shortname || '(Unknow)',
                  instancesNb: _.size(object.instances),
                  resources: i!==undefined && object.instances[i] && _.map(object.instances[i].resources, res => {

                      let resId = res.id;
                      if(object.id<1024){
                          resId = object.id+','+res.id;
                      }

                      return {
                          id: res.id,
                          name: resources_list && resources_list[resId] && resources_list[resId].name || '(Unknow)',
                          shortname: resources_list && resources_list[resId] &&  resources_list[resId].shortname || '(Unknow)'
                      }
                  })

              };
          });
      }

      return objects;
  }
);
