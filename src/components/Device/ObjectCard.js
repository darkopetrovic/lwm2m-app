import _ from "lodash";
import React, {Component} from "react";
import { connect } from "react-redux";
import { createSelector } from 'reselect'
import PropTypes from 'prop-types';

import {Container, Grid, Label, Segment} from 'semantic-ui-react'
import ResourceRow from './ResourceRow';

import {makeDebugger} from '../../utils/debug';
import {bindActionCreators} from "redux";
import {discoverObjectResource} from "../../actions";
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
              <ResourceRow oid={oid} iid={iid} rid={resource.id} key={i}/>
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

        debug('render()', did, oid, iid, this.props.resources);

        return (
          <Segment className="object-card">
              <Label attached='top' size="small" >
                  {this.props.object.shortname} (<small>{this.props.object.id} </small>)
                  <div className="float-right mb-0">
                      <button type="button" className="btn btn-secondary btn-sm lwm2m-btn">
                          <i className="icon-refresh" />
                      </button>
                      <button type="button"
                              className="btn btn-secondary btn-sm lwm2m-btn"
                              onClick={() => this.props.discoverObjectResource(did, oid, iid)}
                      >
                          <i className="icon-magnifier" />
                      </button>
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

const mapStateToProps = () => {
    const getObjectsResources = makeGetObjectsResources();
    return (state, props) => {
        return {
            resources: getObjectsResources(state, props),
            device_id: state.devices.active.infos.id
        };
    };
};

ObjectCard.propTypes = {
    object: PropTypes.object
};

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({discoverObjectResource}, dispatch)};
}


export default connect(mapStateToProps, mapDispatchToProps)(ObjectCard);
