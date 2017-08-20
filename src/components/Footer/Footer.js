import React, { Component } from 'react';
import Dock from 'react-dock'
import {connect} from "react-redux";




class Footer extends Component {
    render() {

        const {left_side_bar_open} = this.props;

        // const styles = {
        //     marginLeft: (left_side_bar_open ? 200 : 0),
        //     marginBottom: 100,
        //     backgroundColor: '#666',
        //     opacity: 0.5
        //     // transition: 'margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s !important',
        //     // transition: 'left 0.2s ease-out, top 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s '
        // };

        return (
          <footer className="app-footer">
              <a href="http://coreui.io">CoreUI</a> &copy; 2017 creativeLabs.
              <span className="float-right">Powered by <a href="http://coreui.io">CoreUI</a></span>
          </footer>


    //       <Dock position='bottom' isVisible={false} dimMode="none"
    //     dockStyle={styles} >
    //       sdfsdfsdfsdfsdf
    //     {/*<div onClick={() => this.setState({ isVisible: !this.state.isVisible })}>X</div>*/}
    // </Dock>
        )
    }
}

const mapStateToProps = ({layout}) => {
    return {
        left_side_bar_open: layout.left_side_bar_open
    }
};

function mapDispatchToProps(dispatch) {
    return {dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);

