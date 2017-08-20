import _ from 'lodash';
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from 'reselect';

import {
    Container, Label, Segment, List, Grid, Button, Loader, Popup, Table, Header, Icon, Modal
} from 'semantic-ui-react'

import {makeDebugger} from '../../utils/debug';
import {bindActionCreators} from "redux";
import {
    deleteDeviceModel, fetchDeviceModels,
    SELECT_DEVICE_MODEL
} from "../../actions/actions_devicemodels";
import DeviceModelForm from "./DeviceModelForm";

const debug = makeDebugger('device-observationslist');

/**
 * @property {object} this.refs.deviceModelForm
 */

class DeviceModelsList extends Component {

    state = {
        edit_form_open: false
    };

    componentDidMount() {
        this.props.fetchDeviceModels();
    }


    onModalConfirm() {
        this.refs.deviceModelForm.getWrappedInstance().submit();
    }

    onEditModalClose(){
        this.props.dispatch({
            type: SELECT_DEVICE_MODEL,
            payload: null
        });
        this.setState({edit_form_open: false})
    }

    handleEditClick(id){
        this.props.dispatch({
            type: SELECT_DEVICE_MODEL,
            payload: (this.props.selectedModel===id ? null : id)
        });

        this.setState({edit_form_open: true});
    }

    renderDeviceModels() {
        const {device_models, selectedModel} = this.props;
        debug('renderDeviceModels()', device_models);

        if(!_.size(device_models)){
            return (<Table.Row><Table.Cell>No device models</Table.Cell></Table.Row>)
        }

        /**
         * @property {number} dm.id                 - ID of the Device Model
         * @property {string} dm.name               - Name of the Device Model
         * @property {string} dm.endpoint_prefix    - Device endpoint prefix used to identify a
         *                                            device to belong to this model
         */
        return _.map(device_models, dm => {
            return (
              <Table.Row key={dm.id} verticalAlign="middle">
                  <Table.Cell>{dm.name}</Table.Cell>
                  <Table.Cell>{dm.endpoint_prefix}</Table.Cell>
                  <Table.Cell textAlign="right">
                      <Button.Group size='mini' className="inline-compact-button">
                          <Button icon='pencil' onClick={() => this.handleEditClick(dm.id)} />
                          <Button icon='tasks' positive={selectedModel===dm.id}
                                  onClick={() => this.props.dispatch({
                                      type: SELECT_DEVICE_MODEL,
                                      payload: (selectedModel===dm.id ? null : dm.id)
                                  })}
                                  />
                          <Button icon='delete' onClick={() => this.props.deleteDeviceModel(dm.id)}/>
                      </Button.Group>
                  </Table.Cell>
              </Table.Row>
            );
        })
    }


    render() {
        debug('render()');
        const {isFetching} = this.props;
        return (
              <Container>

                  <Modal size="small" dimmer={false}
                         open={this.state.edit_form_open}
                         onClose={() => this.onEditModalClose()}
                         closeOnDocumentClick
                  >
                      <Modal.Header>Edit Action</Modal.Header>
                      <Modal.Content>
                          <DeviceModelForm ref="deviceModelForm"/>
                      </Modal.Content>
                      <Modal.Actions>
                          <Button color='black'
                                  onClick={() => this.onEditModalClose()}>
                              Close
                          </Button>
                          <Button positive icon='checkmark' labelPosition='right'
                                  content="Save" onClick={() => this.onModalConfirm()}/>
                      </Modal.Actions>
                  </Modal>


                  <Header as='h1' block>
                      <Icon name='clone' />
                      <Header.Content >
                          Device Models
                          <Header.Subheader>
                              Manage device models
                          </Header.Subheader>
                      </Header.Content>
                  </Header>


                  <Loader size='medium' inline='centered' active={isFetching}>Loading</Loader>
                  <Table>
                      <Table.Header>
                          <Table.Row>
                              <Table.HeaderCell>Name</Table.HeaderCell>
                              <Table.HeaderCell>Endpoint Prefix</Table.HeaderCell>
                              <Table.HeaderCell textAlign="right">Actions</Table.HeaderCell>
                          </Table.Row>
                      </Table.Header>

                      <Table.Body>
                          {!isFetching && this.renderDeviceModels()}
                      </Table.Body>
                  </Table>
              </Container>
        );
    }
}

DeviceModelsList.propTypes = {
    device_models: PropTypes.object
};

DeviceModelsList.defaultProps = {
    device_models: {}
};


const mapStateToProps = ({devicemodels}) => {
    return {
        device_models: devicemodels.list,
        isFetching: devicemodels.isFetching || false,
        selectedModel: devicemodels.selectedModel || null
    }
};

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({fetchDeviceModels, deleteDeviceModel}, dispatch)};
}


export default connect(mapStateToProps, mapDispatchToProps)(DeviceModelsList);