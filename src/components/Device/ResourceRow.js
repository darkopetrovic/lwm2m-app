import _ from 'lodash';
import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {readResourceValue, writeResourceValue} from "../../actions/index";
import Loader from 'react-loader';
import {createSelector} from 'reselect';
import classNames from 'classnames';

import {Grid, Button, Popup, Input, Icon} from 'semantic-ui-react';
import {cancelObserveResource, observeResourceValue} from "../../actions";


import {makeDebugger} from '../../utils/debug';
import {getResourceInfos, getResValue} from "../../selectors/selectors_resources";
const debug = makeDebugger('device-resourcerow');

class ResourceRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            write_popup_isopen: false,
            observe_popup_isopen: false,
            cancelingObservation: false
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        debug('componentWillReceiveProps()', nextProps);
        const {isObserved} = nextProps.row_state;
        // TODO: handle error here too
        if(isObserved === false){
            this.setState({observe_popup_isopen: false, cancelingObservation: false});
        }
    }


    onWriteOperationSend() {
        const did = this.props.row_state.did;
        const {oid, iid, rid} = this.props;
        debug('onWriteOperationSend()', oid, iid, rid);
        this.props.writeResourceValue(did, oid, iid, rid,
          this.refs[`payload-${did}${oid}${iid}${rid}`].inputRef.value
        );
        this.setState({write_popup_isopen: false});
    }

    onObserveOperationSend() {
        const did = this.props.row_state.did;
        const {oid, iid, rid} = this.props;
        debug('onObserveOperationSend()', oid, iid, rid);
        this.props.observeResourceValue(did, oid, iid, rid);
        this.setState({observe_popup_isopen: false});
    }

    onCancelObserve(){
        const did = this.props.row_state.did;
        const {oid, iid, rid} = this.props;
        debug('onCancelObserve()', oid, iid, rid);
        this.props.cancelObserveResource(did, oid, iid, rid);
        this.setState({cancelingObservation: true});
    }

    render() {
        const did = this.props.row_state.did;
        const {oid, iid, rid, queued_operations} = this.props;

        debug('render()', oid, iid, rid, this.props.row_state);

        const {resource, value, isFetching, error, isObserved} = this.props.row_state;

        // change the observe button color when the resource is observed
        const btnObserveClass = classNames({
            'btn btn-secondary btn-sm lwm2m-btn': true,
            'resource-observed': isObserved
        });

        // Loader that is show during resource value fetching
        const loader_config = {
            lines: 9,
            length: 0,
            width: 2,
            radius: 5,
            opacity: 0
        };

        const mantaroyClass = classNames({
            'mandatory_resource': resource.mandatory
        });

        if(!resource){
            return null;
        }


        return (
          <Grid.Row key={resource.id} style={{paddingTop: '0', paddingBottom: '3px'}}>
              <Grid.Column width={6} className="resource-row-name">
                  <Popup
                    trigger={<div className={mantaroyClass}>{resource.shortname || resource.id}</div>}
                    header={resource.shortname || resource.id}
                    content={'/' + oid + '/' + iid + '/' + rid}
                    size='small'
                  />
              </Grid.Column>
              <Grid.Column width={4} textAlign="left" style={{paddingRight: '0'}}>

                  {resource.access && resource.access.indexOf('R') >= 0 && (
                    <span>

                        <button type="button"
                                className="btn btn-secondary btn-sm lwm2m-btn"
                                title="Read"
                                onClick={() => this.props.readResourceValue(did, oid, iid, resource.id)}
                        >
                            <i className="icon-refresh"/>
                        </button>

                        <Popup
                          key={'PopupObserve-' + resource.id}
                          trigger={
                              <button type="button" className={btnObserveClass}>
                                  <i className="icon-eye"/>
                              </button>
                          }
                          on='click'
                          open={this.state.observe_popup_isopen}
                          onOpen={() => this.setState({observe_popup_isopen: true})}
                          onClose={() => this.setState({observe_popup_isopen: false})}
                          position='right center'
                        >

                            <Popup.Header>
                                {isObserved ? (<span>Cancel observation</span>) : (<span>Observe resource</span>)}
                            </Popup.Header>
                            <Popup.Content>
                                {isObserved ? (
                                  <Button content="Cancel" color="red"
                                          loading={this.state.cancelingObservation && isObserved}
                                          onClick={() => this.onCancelObserve()}
                                  />
                                ) :(
                                  <Button content="Observe" color="yellow"
                                          onClick={() => this.onObserveOperationSend()}
                                  />
                                )}
                            </Popup.Content>
                        </Popup>
                    </span>
                  )}

                  {resource.access && resource.access.indexOf('W') >= 0 && (
                      <Popup
                        key={'PopupWrite-' + resource.id}
                        trigger={
                            <button type="button" className="btn btn-secondary btn-sm lwm2m-btn">
                                <i className="icon-pencil"/>
                            </button>
                        }
                        open={this.state.write_popup_isopen}
                        onOpen={() => this.setState({write_popup_isopen: true})}
                        onClose={() => this.setState({write_popup_isopen: false})}
                        on='click'
                        position='right center'
                      >
                          <Popup.Header>Write operation</Popup.Header>
                          <Popup.Content>
                              <Input placeholder='Payload'
                                     ref={`payload-${did}${oid}${iid}${rid}`}
                                     action={
                                         <Button content="Send"
                                                 onClick={() => this.onWriteOperationSend()}
                                         />
                                     }
                              />
                          </Popup.Content>
                      </Popup>
                  )}

                  {resource.access && resource.access.indexOf('E') >= 0 && (
                      <button type="button" className="btn btn-secondary btn-sm lwm2m-btn">
                          <i className="icon-control-play"/>
                      </button>
                  )}

              </Grid.Column>
              <Grid.Column width={6} textAlign="right" className="resource-row-value">
                  <Loader loaded={!isFetching} {...loader_config}>
                      { _.size(queued_operations) ? (
                        <Icon name="download"/>
                      ) : ( error ? ( error.name === 'REQUEST_IN_QUEUE' ?
                        <Icon name="download"/>
                        : (<span className="text-danger">{error.name}</span>)

                          ) : (
                            value
                          )
                      )}
                  </Loader>
              </Grid.Column>
          </Grid.Row>


        );
    }

}


const makeGetRowState = () => createSelector(
  getResourceInfos,
  getResValue,
  (state) => state.devices.active.id,
  (state) => state.devices.observations.list,
  (resource, res_value, did, observations) => {
      return {
          did: did,
          resource: resource,
          isObserved: !!_.find(observations, {id: `${did}:/${resource.object_id}/${resource.instance_id}/${resource.id}`}),
          ...res_value
      }
  }
);

const makeGetOwnQueuedReq = () => createSelector (
  (state, props) => state.devices.active.id,
  (state, props) => props.oid,
  (state, props) => props.iid,
  (state, props) => props.rid,
  (state) => state.devices.queued_req,
  (did, oid, iid, rid, qreqs) => {
      const list = _.filter(qreqs, {did: did, oid: oid, iid: iid, rid: rid});
      // we cannot return directly the result of filter because it return by default an
      // empty array and the application is expecting an object
      return _.size(list) ? list : null
  }
);


const mapStateToProps = () => {
    const getRowState = makeGetRowState();
    const getOwnQueuedReq = makeGetOwnQueuedReq();
    return (state, props) => {
        return {
            row_state: getRowState(state, props),
            queued_operations: getOwnQueuedReq(state, props)
        }
    }
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        readResourceValue,
        writeResourceValue,
        observeResourceValue,
        cancelObserveResource
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceRow);
