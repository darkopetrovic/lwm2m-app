import _ from 'lodash';
import React, {Component} from "react";
import {connect} from "react-redux";
import {createSelector} from 'reselect';

import {push} from 'react-router-redux';

import {
    Container, Label, Segment, List, Header, Grid, Button, Confirm,
    Popup, Icon, Progress, Modal
} from 'semantic-ui-react'

import {makeDebugger} from '../../utils/debug';
import {bindActionCreators} from "redux";
import {addAsAModel} from "../../actions/actions_devicemodels";


import Moment from "react-moment";
import {getActiveDevice} from "../../selectors/selector_devices";
import LifetimeBar, {computeRemainingLifetime} from "./LifetimeBar";

const debug = makeDebugger('device-infos');

/**
 * @property {Date} device_info.id
 * @property {Date} device_info.type
 * @property {Date} device_info.name
 * @property {Date} device_info.binding
 * @property {Date} device_info.lifetime
 * @property {Date} device_info.path
 * @property {Date} device_info.port
 * @property {Date} device_info.address
 * @property {Date} device_info.creationDate
 * @property {Date} device_info.lastSeen
 */

class DeviceInfos extends Component {

    constructor(props) {
        super(props);

        this.state = {
            add_as_model_confirm_show: false,
            adding_as_model: false,
            alert_modal_open: false,
            internal_device_id: null
        };

    }

    componentWillReceiveProps(nextProps, nextContext) {
        debug('componentWillReceiveProps()', nextProps);

        const {device_id} = nextProps;
        // The same device (with the same Endpoint name) register again and get a
        // new ID from the server. The user shouldn't remain on this page.
        if(!device_id && this.state.internal_device_id){
            this.setState({alert_modal_open: true});
        }

        if(!this.state.internal_device_id && nextProps.device_id){
            this.setState({internal_device_id: nextProps.device_id});
        }

    }

    onAddAsAModel() {
        const {device_info} = this.props;
        this.setState({adding_as_model: true});
        this.props.addAsAModel(device_info.id).then(() => {
            this.setState({
                add_as_model_confirm_show: false,
                adding_as_model: false
            })
        });
    }

    render() {
        const {device_info} = this.props;
        debug('render()', device_info);
        const {adding_as_model, alert_modal_open} = this.state;

        if(!device_info){
            return (<div>No connection</div>)
        }
        const remainingLifetime = computeRemainingLifetime(device_info);

        return (
          <div>

              <Modal
                open={alert_modal_open}
                onClose={this.handleClose}
                basic
                size='small'
              >
                  <Header icon='browser' content='Device no longer active' />
                  <Modal.Content>
                      <h3>You will be redirected to the devices list.</h3>
                  </Modal.Content>
                  <Modal.Actions>
                      <Button color='green' onClick={() => this.props.dispatch(push('/devices'))} inverted>
                          <Icon name='checkmark' /> Got it
                      </Button>
                  </Modal.Actions>
              </Modal>

              <Header as='h1' block>
                  <Icon name='mobile' size="big" />
                  <Header.Content>
                      Device details
                      <Header.Subheader>
                          Configure the device
                      </Header.Subheader>
                  </Header.Content>
              </Header>

              { !device_info ? (
                <Segment>
                    Connection lost.
                </Segment>
                ) : (
                <Segment style={{paddingBottom: '50px'}}>
                    <Label attached='bottom' size="small" className="actionsLabel">

                        <Popup
                          key={'PopupAddDeviceAsModel'}
                          trigger={
                              <Button basic content='Add as a model' floated="right"
                                      icon='plus' labelPosition='left' size="mini"
                                      onClick={() => this.setState({add_as_model_confirm_show: true})}
                              />
                          }
                          open={this.state.add_as_model_confirm_show}
                          onOpen={() => this.setState({add_as_model_confirm_show: true})}
                          onClose={() => this.setState({add_as_model_confirm_show: false})}
                          on='click'
                          position='bottom center'
                        >
                            <Popup.Header>Add this device as a model</Popup.Header>
                            <Popup.Content>
                                <Button content="Add as a model" loading={adding_as_model}
                                        onClick={() => this.onAddAsAModel()}
                                />
                            </Popup.Content>
                        </Popup>

                        <Button floated='right' basic size='mini' content='Ping' icon='compress'
                                labelPosition='left'/>
                    </Label>
                    <Container>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='tags' size='large' verticalAlign='middle'
                                           color="grey"/>
                                <List.Content>
                                    <List.Header>Endpoint name</List.Header>
                                    {device_info.name}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='globe' size='large' verticalAlign='middle'
                                           color="grey"/>
                                <List.Content>
                                    <List.Header>IP Address </List.Header>
                                    {device_info.address}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plug' size='large' verticalAlign='middle'
                                           color="grey"/>
                                <List.Content>
                                    <List.Header>Binding</List.Header>
                                    {device_info.binding}
                                </List.Content>
                            </List.Item>

                            <List.Item>
                                <List.Icon name='calendar' size='large' verticalAlign='middle'
                                           color="grey"/>
                                <List.Content>
                                    <List.Header>Creation date</List.Header>
                                    <Moment format="DD/MM/YYYY HH:mm:ss">{device_info.creationDate}</Moment>
                                </List.Content>
                            </List.Item>

                            <List.Item>
                                <List.Icon name='history' size='large' verticalAlign='middle'
                                           color="grey"/>
                                <List.Content>
                                    <List.Header>Last seen</List.Header>
                                    <Moment format="DD/MM/YYYY HH:mm:ss">{device_info.lastSeen}</Moment>
                                </List.Content>
                            </List.Item>

                            <List.Item>
                                <List.Icon name='hourglass half' size='large' verticalAlign='middle'
                                           color="grey"/>
                                <List.Content style={{width: '100%'}}>
                                    <List.Header>Lifetime</List.Header>
                                    <LifetimeBar remaining={parseInt(remainingLifetime)} total={parseInt(device_info.lifetime)}/>
                                </List.Content>
                            </List.Item>

                        </List>
                    </Container>

                </Segment>
              )
              }

          </div>
        );
    }


}


const mapStateToProps = (state) => {
    return {
        device_info: getActiveDevice(state),
        device_id: state.devices.active.id
    }
};

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({addAsAModel}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceInfos);