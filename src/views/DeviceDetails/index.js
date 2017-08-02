import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchDevice, fetchObjects, fetchResources, getResourceValue } from "../../actions";
import { bindActionCreators } from "redux";

import DeviceInfos from '../../components/Device/DeviceInfos';
import TabsObjects from '../../components/Device/TabsObjects';

import { Card, CardHeader, CardTitle, CardBlock, CardText, Container, Row, Col, Progress } from 'reactstrap';

class DeviceDetails extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.fetchDevice(id);
        this.props.fetchObjects();
        this.props.fetchResources();
    }

    render() {
        const { device } = this.props;

        if (!device) {
            return <div>Loading...</div>;
        }

        return (
          <div className="animated fadeIn">
              <Row>
                  <Col xs="4">
                      <DeviceInfos />
                  </Col>
                  <Col xs="8">
                    <TabsObjects/>
                  </Col>
              </Row>
          </div>
        );
    }
}

function mapStateToProps({devices, objects, resources}, ownProps) {
    return {
        device: devices.active,
        objects: objects,
        resources: resources
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchDevice, fetchObjects, fetchResources, getResourceValue }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetails);
