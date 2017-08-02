import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchDevices } from "../../actions/index";
import { bindActionCreators } from "redux";
import Masonry from 'react-masonry-component';
import { Link } from "react-router-dom";

import { Card, Button, CardHeader, CardBlock,
  Progress } from 'reactstrap';

const masonryOptions = {
  transitionDuration: 500
};

class DevicesList extends Component {
  componentDidMount() {
    this.props.fetchDevices();
  }


  renderList() {
    return _.map(this.props.devices, device => {
      return (

        <div className="device-grid-item" key={device.id}>
          <Card className="device-card">
            <CardHeader>
              <i className="fa fa-dot-circle-o" style={{color: '#4dbd74'}}/>{device.name}

              <div className="device-card-action float-right mb-0">
                <Link className="btn btn-link" to={`/devices/${device.id}`}>
                  <i className="icon-settings" />
                </Link>

              </div>
            </CardHeader>
            <CardBlock className="device-card-body">
              <ul className="horizontal-bars type-2">
                <li>
                  <i className="icon-globe" />
                  <span className="title ipaddress">{device.address}</span>
                </li>

                <li>
                  <i className="fa fa-clock-o" />
                  <span className="title">Lifetime</span>
                  <span className="value">37s</span>
                  <div className="bars">
                    <Progress className="progress-xs" color="warning" value="37" />
                  </div>
                </li>

                <li>
                  <i className="fa fa-battery-three-quarters" />
                  <span className="title">Battery</span>
                  <span className="value">67%</span>
                  <div className="bars">
                    <Progress className="progress-xs" color="success" value="67" />
                  </div>
                </li>

                <li>
                  <i className="fa fa-eye" />
                  <span className="title">Last seen</span>
                  <span className="value">{device.creationDate}</span>

                </li>

              </ul>

            </CardBlock>
          </Card>
        </div>

      );
    });
  }

  render() {
    return (
      <div>
        <Masonry
          className={''} // default ''
          elementType={'div'} // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          {this.renderList()}
        </Masonry>
      </div>
    );
  }
}

function mapStateToProps({devices}) {
  return {
    devices: devices.list
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchDevices }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(DevicesList);
