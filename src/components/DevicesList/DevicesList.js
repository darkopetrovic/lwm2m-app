import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchDevices } from "../../actions/index";
import { bindActionCreators } from "redux";
import Masonry from 'react-masonry-component';

import DeviceCard from "../Device/DeviceCard";



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
                <DeviceCard device={device}/>
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
