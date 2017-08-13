import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    Segment, Label, Container, Table, Icon, Header, Grid, Input,
    Dropdown, Button, Modal
} from "semantic-ui-react";
import ActionForm from "./ActionForm";
import {deleteAction, fetchActions, updateAction} from "../../actions/actions_actions";
import {makeDebugger} from '../../utils/debug';
import classNames from 'classnames';

const debug = makeDebugger('devicemodel-actions');

class DeviceModelActions extends Component {

    state = {
        add_action_modal_open: false
    };

    componentWillMount() {
        this.props.fetchActions();
    }


    onAddActionClose = () => this.setState({add_action_modal_open: false});

    onAddActionSubmit() {
        this.refs.actionForm.getWrappedInstance().submit();
    }

    handleDeleteAction(aid) {
        this.props.deleteAction(aid).then((data) => {


            console.log("THE DATA", data);
        });
    }

    renderActions() {
        const {actions} = this.props;

        return _.map(actions, action => {
            console.log(action)
            return (
              <Table.Row key={action.id}>
                  <Table.Cell
                    width={5}>{action.device_model && action.device_model.name}</Table.Cell>
                  <Table.Cell width={4}>{action.command}</Table.Cell>
                  <Table.Cell width={4}>
                      <Label size="mini" basic> /{action.oid}/{action.iid}/{action.rid} </Label>
                  </Table.Cell>
                  <Table.Cell width={3}>
                      <Button.Group  size='mini' className="inline-compact-button">
                          <Button icon='checkmark' positive={action.activated}
                                  onClick={() => this.props.updateAction(action.id, {activated: !action.activated})}/>
                          <Button icon='delete'
                                  onClick={() => this.handleDeleteAction((action.id))}/>
                      </Button.Group>
                  </Table.Cell>
              </Table.Row>
            );
        });
    }

    render() {
        debug('render()', this.props.actions);
        return (
          <div>

              <Modal size="small" dimmer={false}
                     open={this.state.add_action_modal_open}
                     onClose={this.onAddActionClose}
                     closeOnDocumentClick
              >
                  <Modal.Header>Add Action</Modal.Header>
                  <Modal.Content>
                      <ActionForm ref="actionForm"/>
                  </Modal.Content>
                  <Modal.Actions>
                      <Button color='black'
                              onClick={() => this.setState({add_action_modal_open: false})}>
                          Close
                      </Button>
                      <Button positive icon='checkmark' labelPosition='right'
                              content="Add Action" onClick={() => this.onAddActionSubmit()}/>
                  </Modal.Actions>
              </Modal>


              <Container>
                  <Header as='h2'>Actions</Header>

                  <Segment>
                      <Grid columns={3}>
                          <Grid.Row>
                              <Grid.Column>
                                  <Input fluid icon='search' iconPosition='left'
                                         placeholder="Search" className="input-search"/>
                              </Grid.Column>
                              <Grid.Column>
                                  <Dropdown placeholder='Filter by owner'
                                            floating labeled button className='icon'
                                            icon='filter' basic fluid selectOnBlur={false}
                                  />
                              </Grid.Column>
                              <Grid.Column>
                                  <Button basic fluid content='Add action'
                                          icon='plus' labelPosition='left'
                                          onClick={() => this.setState({add_action_modal_open: true})}
                                  />
                              </Grid.Column>
                          </Grid.Row>

                      </Grid>
                  </Segment>

                  <Table celled size='small'>
                      <Table.Header>
                          <Table.Row>
                              <Table.HeaderCell>Device Model</Table.HeaderCell>
                              <Table.HeaderCell>Command</Table.HeaderCell>
                              <Table.HeaderCell>Path</Table.HeaderCell>
                              <Table.HeaderCell>Actions</Table.HeaderCell>
                          </Table.Row>
                      </Table.Header>

                      <Table.Body>
                          {this.renderActions()}
                      </Table.Body>
                  </Table>
              </Container>
          </div>
        );
    }


}

DeviceModelActions.propTypes = {};
DeviceModelActions.defaultProps = {};

function mapStateToProps({actions}) {
    return {
        actions: actions.list
    };
}

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({fetchActions, deleteAction, updateAction}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceModelActions);