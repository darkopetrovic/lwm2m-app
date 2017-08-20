import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {fetchQueuedRequests} from "../../actions";
import {Button, Header, Icon, Label, List} from "semantic-ui-react";

import classnames from 'classnames'

import {makeDebugger} from '../../utils/debug';
const debug = makeDebugger('queued-requests');

class QueuedRequests extends Component {

    componentWillMount() {
        this.props.fetchQueuedRequests();
    }

    renderQueuedRequests(){
        const {queued_requests, devices} = this.props;

        return _.map(queued_requests, (req, i) => {

            const itemstyle = classnames({
                'callout m-0 py-3': true,
                'callout-info': req.operation === 'read',
                'callout-warning': req.operation === 'write',
                'callout-success': req.operation === 'observe',
                'callout-error': req.operation === 'execute',
                'callout': req.operation === 'discover',
            });

            return (
              <div key={i}>
                  <div className={itemstyle}>
                      <div className="float-right">
                          {/*<List.Icon name='download' size='large' verticalAlign='middle' color="grey"/>*/}
                      </div>
                      <div><strong>{devices[req.did] && devices[req.did].name}</strong></div>
                      <small className="text-muted mr-3"><i className="fa fa-download" />&nbsp; {req.operation}</small>
                      <small className="text-muted"><i className="fa fa-cube" />&nbsp; {req.oid}/{req.iid}/{req.rid} </small>
                  </div>
                  <hr className="mx-3 my-0"/>
              </div>
            )
        })
    }

    render() {
        const {queued_requests} = this.props;
        debug('render()', queued_requests);
        return (

          <div>
              <div className="callout m-0 py-2 text-muted text-center bg-faded text-uppercase">
                  <small><b>Queued requests</b></small>
              </div>
              <hr className="transparent mx-3 my-0"/>

              {this.renderQueuedRequests()}




              {/*<Header as='h4' block className="title_queued_request">*/}
                  {/*Queued requests*/}
              {/*</Header>*/}
              {/*<List celled relaxed verticalAlign='middle'>*/}
                  {/**/}
              {/*</List>*/}

          </div>
        );
    }
}

QueuedRequests.propTypes = {};
QueuedRequests.defaultProps = {};

function mapStateToProps({devices}) {
    return {
        queued_requests: devices.queued_req,
        devices: devices.list
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchQueuedRequests}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QueuedRequests);