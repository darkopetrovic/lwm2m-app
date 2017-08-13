import React, {Component} from "react";
import { connect } from "react-redux";
import { createSelector } from 'reselect';

import {
    Container, Label, Segment, List, Header, Grid, Button, Confirm,
    Popup
} from 'semantic-ui-react'

import {makeDebugger} from '../../utils/debug';
import Divider from "semantic-ui-react/dist/es/elements/Divider/Divider";
import {bindActionCreators} from "redux";
import {addAsAModel} from "../../actions/actions_devicemodels";
const debug = makeDebugger('device-infos');

class DeviceInfos extends Component {

    state = {
        add_as_model_confirm_show: false,
        adding_as_model: false
    };

    onAddAsAModel(){
        const { device_info } = this.props;
        this.setState({adding_as_model: true})
        this.props.addAsAModel(device_info.id).then(() => {
            this.setState({
                add_as_model_confirm_show: false,
                adding_as_model: false
            })
        });
    }

    render(){
        debug('render()');
        const { device_info } = this.props;
        const { adding_as_model } = this.state;
        if (!device_info) {
            return <div>Loading...</div>;
        }

        return (
          <div>
              <Header as='h1'>Device details</Header>

              <Segment style={{paddingBottom: '50px'}}>
                  <Label attached='bottom' size="small" className="actionsLabel">

                      <Popup
                        key={'PopupAddDeviceAsModel'}
                        trigger={
                            <Button basic content='Add as a model' floated="right"
                                    icon='plus' labelPosition='left' size="mini"
                                    onClick={() => this.setState({add_as_model_confirm_show: true})}
                            />
                        }
                        open={this.state.add_as_model_confirm_show}
                        onOpen={() => this.setState({add_as_model_confirm_show: true})}
                        onClose={() => this.setState({add_as_model_confirm_show: false})}
                        on='click'
                        position='bottom center'
                      >
                          <Popup.Header>Add this device as a model</Popup.Header>
                          <Popup.Content>
                              <Button content="Add as a model" loading={adding_as_model}
                                      onClick={() => this.onAddAsAModel()}
                              />
                          </Popup.Content>
                      </Popup>

                      <Button floated='right' basic size='mini' content='Ping' icon='compress' labelPosition='left' />
                  </Label>
                  <Container>
                      <List divided relaxed>
                          <List.Item>
                              <List.Icon name='tags' size='large' verticalAlign='middle' color="grey"/>
                              <List.Content>
                                  <List.Header>Endpoint name</List.Header>
                                  {device_info.name}
                              </List.Content>
                          </List.Item>
                          <List.Item>
                              <List.Icon name='globe' size='large' verticalAlign='middle' color="grey" />
                              <List.Content>
                                  <List.Header>IP Address </List.Header>
                                  2001:db8:85a3:8d3:1319:8a2e:370:7348
                              </List.Content>
                          </List.Item>
                          <List.Item>
                              <List.Icon name='plug' size='large' verticalAlign='middle' color="grey" />
                              <List.Content>
                                  <List.Header>Binding</List.Header>
                                  U
                              </List.Content>
                          </List.Item>
                          <List.Item>
                              <List.Icon name='history' size='large' verticalAlign='middle' color="grey" />
                              <List.Content>
                                  <List.Header>Last seen</List.Header>
                                  23.11.2017 13:45:22
                              </List.Content>
                          </List.Item>
                      </List>
                  </Container>

              </Segment>

          </div>
        );
    }


}


const getDeviceInfo = createSelector (
  (state) => state.devices.active.infos,
  (device_infos) => device_infos
);


const mapStateToProps = (state) => {
    if(!state.devices.active){
        return;
    }
    return {
        device_info: getDeviceInfo(state)
    }
};

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({addAsAModel}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceInfos);