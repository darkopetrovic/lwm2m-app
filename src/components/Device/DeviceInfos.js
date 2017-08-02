import React, {Component} from "react";
import { connect } from "react-redux";

import { Card, CardHeader, CardTitle, CardBlock, CardText, Container, Row, Col, Progress } from 'reactstrap';

class DeviceInfos extends Component {

    render(){
        const { device } = this.props;

        return (
          <Card>
              <CardHeader><CardTitle>Device details</CardTitle></CardHeader>
              <CardBlock className="device-card-body device-details">

                  <ul>
                      <Row noGutters>
                          <Col>
                              <li>
                                  <label>Endpoint name</label>
                                  <div className="">{device.name}</div>
                              </li>
                          </Col>
                      </Row>

                      <Row noGutters>
                          <Col xs="9">
                              <li>
                                  <label>IP Address</label>
                                  <div className="">{device.address}</div>
                              </li>
                          </Col>
                          <Col xs="3">
                              <li>
                                  <label>Binding</label>
                                  <div>{device.binding}</div>
                              </li>
                          </Col>
                      </Row>

                      <Row noGutters>
                          <Col xs="8">
                              <li>
                                  <label>Last seen</label>
                                  <div className="">This is the ip address</div>
                              </li>
                          </Col>
                          <Col xs="4">
                              <li>
                                  <label>Lifetime</label>
                                  <div> <Progress value="80">356</Progress></div>
                              </li>
                          </Col>
                      </Row>

                  </ul>

              </CardBlock>
          </Card>
        );
    }


}

function mapStateToProps({devices}) {
    return {
        device: devices.active
    };
}

export default connect(mapStateToProps)(DeviceInfos);