import React, {Component} from 'react';
import {connect} from "react-redux";
import {makeDebugger} from "../../utils/debug";
import {Button, Header, Icon, Modal} from "semantic-ui-react";


const debug = makeDebugger('alerts');

class ApplicationAlerts extends Component {

    state = {
        mounted: false,
        alert_modal_open: false
    };

    componentDidMount() {
        this.setState({mounted: true});
    }

    componentWillReceiveProps(nextProps, nextContext) {

    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !this.state.mounted
    }

    handleClose = (e) => this.setState({
        alert_modal_open: false,
    });

    render(){
        debug('render()');
        return (
          <Modal
            open={this.state.alert_modal_open}
            onClose={this.handleClose}
            basic
            size='small'
          >
              <Header icon='browser' content='Cookies policy' />
              <Modal.Content>
                  <h3>This website uses cookies to ensure the best user experience.</h3>
              </Modal.Content>
              <Modal.Actions>
                  <Button color='green' onClick={this.handleClose} inverted>
                      <Icon name='checkmark' /> Got it
                  </Button>
              </Modal.Actions>
          </Modal>
        )
    }
}
const mapStateToProps = ({devices}) => {
    return {
        device_name: devices.active.infos.name
    };
};

export default connect(mapStateToProps, null)(ApplicationAlerts);