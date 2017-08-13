import _ from 'lodash';
import { createSelector } from 'reselect';

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
          const device_model_objects = device_models[dm].objects;

          objects = _.map(device_model_objects, object => {
              return {
                  id: object.id,
                  name: objects_list[object.id].name,
                  shortname: objects_list[object.id].shortname,
                  instancesNb: _.size(object.instances),
                  resources: i!==undefined && object.instances[i] && _.map(object.instances[i].resources, res => {
                      return {
                          id: res.id,
                          name: resources_list[res.id].name,
                          shortname: resources_list[res.id].shortname
                      }
                  })

              };
          });
      }

      return objects;
  }
);
