import _ from 'lodash';
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from 'reselect';

import {
    Container, Label, Segment, List, Grid, Button, Loader, Popup, Table, Header
} from 'semantic-ui-react'

import {makeDebugger} from '../../utils/debug';
import {bindActionCreators} from "redux";
import {
    deleteDeviceModel, fetchDeviceModels,
    SELECT_DEVICE_MODEL
} from "../../actions/actions_devicemodels";

const debug = makeDebugger('device-observationslist');

class DeviceModelsList extends Component {

    state = {

    };

    componentDidMount() {
        this.props.fetchDeviceModels();
    }


    renderDeviceModels() {
        const {device_models, selectedModel} = this.props;
        debug('renderDeviceModels()', device_models);

        if(!_.size(device_models)){
            return (<Table.Row><Table.Cell>No device models</Table.Cell></Table.Row>)
        }

        return _.map(device_models, dm => {
            return (
              <Table.Row key={dm.id} verticalAlign="middle">
                  <Table.Cell>{dm.name}</Table.Cell>
                  <Table.Cell>{dm.endpoint_prefix}</Table.Cell>
                  <Table.Cell textAlign="right">
                      <Button.Group  size='mini' className="inline-compact-button">
                          <Button icon='pencil' />
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
                  <Header as='h1'>Device Models</Header>
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