import React, { Component } from "react";
import { connect } from "react-redux";
import {fetchDevice, fetchQueuedRequests, readResourceValue} from "../../actions";
import { fetchObjects, fetchResources } from "../../actions/actions_objectdb";
import { bindActionCreators } from "redux";

import DeviceInfos from '../../components/Device/DeviceInfos';
import TabsObjects from '../../components/Device/TabsObjects';

import { Row, Col } from 'reactstrap';
import {fetchDeviceObservations} from "../../actions/actions_observations";
import ObservationsList from "../../components/Device/ObservationsList";

class DeviceDetails extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.fetchDevice(id);
        this.props.fetchObjects();
        this.props.fetchResources();
        this.props.fetchDeviceObservations(id);
        this.props.fetchQueuedRequests();
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: 'CLEAR_ACTIVE_DEVICE'
        })
    }

    render() {
        return (
          <div className="animated fadeIn">
              <Row>
                  <Col xs="4">
                      <DeviceInfos />
                      <ObservationsList />
                  </Col>
                  <Col xs="8">
                      <TabsObjects/>
                  </Col>
              </Row>
          </div>
        );
    }
}

// function mapStateToProps({devices}) {
//     return {
//         device_info: devices.active.infos
//     }
// }

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({ fetchDevice, fetchObjects,
        fetchResources, fetchDeviceObservations, fetchQueuedRequests }, dispatch)};
}

export default connect(null, mapDispatchToProps)(DeviceDetails);
