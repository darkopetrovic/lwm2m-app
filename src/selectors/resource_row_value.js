import _ from 'lodash';
import { createSelector } from 'reselect'


const deviceObjects = (state, props) => {
    return state.devices.active;
};


const getResourceRowState = (state, props) => {
    let device = state.devices.active;

    const oidx = _.findIndex(device.objects, {id: props.oid});
    const iidx = _.findIndex(device.objects[oidx].instances, {id: props.iid});
    const ridx = _.findIndex(device.objects[oidx].instances[iidx].resources, {id: props.rid});

    return {
        did: device.id,
        resource: device.objects[oidx].instances[iidx].resources[ridx],
        value: device.objects[oidx].instances[iidx].resources[ridx].value,
        isFetching: device.objects[oidx].instances[iidx].resources[ridx].isFetching
    }
};

const makeGetResourceRowState = () => {
    return createSelector(
      getResourceRowState
    )
};

export default makeGetResourceRowState;