import React, {Component} from 'react';
import {connect} from "react-redux";
import {makeDebugger} from "../../utils/debug";
import { ToastContainer, ToastMessage } from 'react-toastr';


const debug = makeDebugger('toasts');
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

class ApplicationToast extends Component {

    state = {
        mounted: false
    };

    componentDidMount() {
        this.setState({mounted: true});
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.toast){
            const {title, message} = nextProps.toast;
            this.addToast(title, message);
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !this.state.mounted
    }

    addToast (title, message) {
        this.container.success(
          message,
          title,
          {
              timeOut: 5000,
              extendedTimeOut: 10000
          });
    }

    render(){
        debug('render()');
        return (
          <ToastContainer ref={(input) => {this.container = input; }}
                          toastMessageFactory={ToastMessageFactory}
                          className="toast-top-right"/>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        toast: state.toasts.toast
    };
};

export default connect(mapStateToProps, null)(ApplicationToast);