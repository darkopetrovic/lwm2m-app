import _ from "lodash";
import React, {Component} from "react";
import { connect } from "react-redux";
import { createSelector } from 'reselect'
import PropTypes from 'prop-types';

import {Container, Grid, Icon, Label, Segment} from 'semantic-ui-react'
import ResourceRow from './ResourceRow';

import {makeDebugger} from '../../utils/debug';
import {bindActionCreators} from "redux";
import {discoverObjectResources, readObjectResources} from "../../actions";
const debug = makeDebugger('device-objectcard');

class ObjectCard extends Component {
    constructor(props) {
        super(props);
    }

    renderResources(resources) {
        const oid = this.props.object.id;
        const iid = this.props.object.instance_id;
        return _.map(resources, (resource, i)  => {
            return (
              <ResourceRow oid={oid} iid={iid} rid={parseInt(resource.id)} key={i}/>
            );
        });
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        // re-render the parent to re-configure Masonry if the number of resources has changed
        if(_.size(this.props.resources) !== _.size(nextProps.resources)){
            this.props.callback();
        }
    }

    render () {
        const did = this.props.device_id;
        const oid = this.props.object.id;
        const iid = this.props.object.instance_id;

        const {queued_messages} = this.props;

        debug('render()', did, oid, iid, this.props.resources, queued_messages);

        return (
          <Segment className="object-card">
              <Label attached='top' size="small" >
                  {this.props.object.shortname} (<small>{this.props.object.id}</small>)
                  <div className="float-right mb-0">

                      {_.find(queued_messages, {operation: 'read', rid: null}) ? (
                        <Icon name="download"/>
                      ) : (
                        <button type="button"
                                className="btn btn-secondary btn-sm lwm2m-btn"
                                onClick={() => this.props.readObjectResources(did, oid, iid)}
                        >
                            <i className="icon-refresh" />
                        </button>
                      )}

                      {_.find(queued_messages, {operation: 'discover'}) ? (
                        <Icon name="download"/>
                      ) : (
                        <button type="button"
                                className="btn btn-secondary btn-sm lwm2m-btn"
                                onClick={() => this.props.discoverObjectResources(did, oid, iid)}
                        >
                            <i className="icon-magnifier" />
                        </button>
                      )}

                  </div>
              </Label>
              <Grid style={{paddingBottom: '5px'}}>
                  {this.renderResources(this.props.resources)}
              </Grid>
          </Segment>
        );
    }

}

/**
 * Get from the store the object's associated resources.
 *
 * The prop <object> passed to the component must contains the following properties :
 *
 *  id, instance_id
 */
const makeGetObjectsResources = () => createSelector (
  (state, props) => props.object,
  (state) => state.devices.active.resources,
  (object_infos, devices_resources) => {
      return _.filter(devices_resources, {object_id: object_infos.id, instance_id: object_infos.instance_id})
  }
);

const makeGetOwnQueuedReq = () => createSelector (
  (state, props) => state.devices.active.id,
  (state, props) => props.object,
  (state) => state.devices.queued_req,
  (did, obj, qreq) => {
      const list = _.filter(qreq, {did: did, oid: obj.id, iid: obj.instance_id});
      // we cannot return directly the result of filter because it return by default an
      // empty array and the application is expecting an object
      return _.size(list) ? list : null
  }
);

const mapStateToProps = () => {
    const getObjectsResources = makeGetObjectsResources();
    const getOwnQueuedReq = makeGetOwnQueuedReq();
    return (state, props) => {
        return {
            resources: getObjectsResources(state, props),
            device_id: state.devices.active.id,
            queued_messages: getOwnQueuedReq(state, props)
        };
    };
};

ObjectCard.propTypes = {
    object: PropTypes.object,
    queued_messages: PropTypes.array
};


function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({discoverObjectResources, readObjectResources}, dispatch)};
}


export default connect(mapStateToProps, mapDispatchToProps)(ObjectCard);
