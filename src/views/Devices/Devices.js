import React, { Component } from 'react';
import DevicesList from '../../components/DevicesList/DevicesList';


class Devices extends Component {

  render() {
    return (
      <div className="animated fadeIn">
        <DevicesList />
      </div>
    )
  }
}

export default Devices;
