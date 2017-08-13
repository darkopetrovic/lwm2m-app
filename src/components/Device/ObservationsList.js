import _ from 'lodash';
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from 'reselect';

import {
    Container, Label, Segment, List, Grid, Button, Loader, Popup
} from 'semantic-ui-react'

import {makeDebugger} from '../../utils/debug';
import {getDeviceResources} from "../../selectors/selectors_resources";
import {getDeviceObservations} from "../../selectors/selector_observations";
import {bindActionCreators} from "redux";
import {cancelObserveResource} from "../../actions";

const debug = makeDebugger('device-observationslist');

class ObservationsList extends Component {

    state = {
        selected_observation: null,
        canceling: null
    };

    componentWillReceiveProps(nextProps, nextContext) {
        // an observation has been canceled
        if(_.size(nextProps.device_observations) < _.size(this.props.device_observations)){
            this.setState({canceling: false});
        }

        //const canceledResource = _.difference(_.keys(this.props.device_observations), _.keys(nextProps.device_observations));
    }


    onCancelObserve(did, oid, iid, rid){
        this.props.cancelObserveResource(did, oid, iid, rid);
        this.setState({canceling: true});
    }

    renderObservations() {
        const {device_observations, resources} = this.props;
        debug('renderObservations()', device_observations);

        if(!_.size(device_observations)){
            return (<span>No observations</span>)
        }

        const {canceling} = this.state;

        return _.map(device_observations, obs => {
            const resId = `${obs.oid}${obs.iid}${obs.rid}`;

            return (
              <List.Item key={obs.id}>
                  <List.Content>
                      <Grid>
                          <Grid.Row verticalAlign="middle">
                              <Grid.Column width={6}>
                                  {resources[resId].name || resources[resId].shortname}
                              </Grid.Column>
                              <Grid.Column width={5}>
                                  <Label size="mini" basic> {obs.path} </Label>
                              </Grid.Column>
                              <Grid.Column width={5} textAlign="right">
                                  <Button.Group basic size='mini' className="inline-compact-button actions_dropdown">
                                      <Button icon='search' />
                                      <Button icon='edit' />

                                      <Popup
                                        key={'PopupCancelObserve-' + obs.id}
                                        trigger={
                                            <Button icon='cancel' className="text-danger"/>
                                        }
                                        on='click'
                                        open={this.state.selected_observation === obs.id}
                                        onOpen={() => this.setState({selected_observation: obs.id})}
                                        onClose={() => this.setState({selected_observation: null})}
                                        position='right center'
                                      >
                                          <Popup.Header as="h2">Cancel observe</Popup.Header>
                                          <Popup.Content>
                                              <Button content="Cancel" color="red"
                                                      loading={this.state.selected_observation === obs.id && canceling}
                                                      onClick={() => this.onCancelObserve(obs.did, obs.oid, obs.iid, obs.rid)}
                                              />
                                          </Popup.Content>
                                      </Popup>




                                  </Button.Group>
                              </Grid.Column>
                          </Grid.Row>
                      </Grid>
                  </List.Content>
              </List.Item>
            );
        })
    }


    render() {
        debug('render()');
        const {isFetching} = this.props;
        return (
          <Segment padded>
              <Label attached='top' size="large" color="yellow">
                  Observations
              </Label>
              <Container>
                  <Loader size='medium' inline='centered' active={isFetching}>Loading</Loader>
                  {!isFetching && <List divided relaxed>{this.renderObservations()}</List>}
              </Container>
          </Segment>
        );
    }
}

ObservationsList.propTypes = {
    device_observations: PropTypes.object,
    resources: PropTypes.object,
    isFetching: PropTypes.bool
};

ObservationsList.defaultProps = {
    device_observations: {},
    resources: {},
    isFetching: false
};


const mapStateToProps = (state) => {
    return {
        resources: getDeviceResources(state),
        device_observations: getDeviceObservations(state),
        isFetching: state.devices.active.observations.isFetching
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
          cancelObserveResource
      }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(ObservationsList);