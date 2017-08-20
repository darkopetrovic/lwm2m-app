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

/**
 * @property {object} this.refs.actionForm
 *
 */
class DeviceModelActions extends Component {

    state = {
        action_modal_open: false
    };

    componentWillMount() {
        this.props.fetchActions();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({action_modal_open: false})
    }


    onAddActionClose(e) {
        // Somehow the last trash button of the services list is triggering a mouse event
        // and the modal thinks that the user clicked outside to close the modal.
        // We prevent that to happen.
        console.log(e && e.target.className)
        if(!e || (e && e.target.className !== 'trash icon' && e.target.className !== 'ui red icon button')){
            this.props.dispatch({
                type: 'SELECT_ACTION',
                payload: null
            });
            this.setState({action_modal_open: false});
        }
    };

    handleEditAction(aid){
        this.props.dispatch({
            type: 'SELECT_ACTION',
            payload: aid
        });
        this.setState({action_modal_open: true});
    }

    handleDeleteAction(aid) {
        this.props.deleteAction(aid).then((data) => {

        });
    }

    renderActions() {
        const {actions} = this.props;

        if(!_.size(actions)){
            return(<Table.Row><Table.Cell>No actions</Table.Cell></Table.Row>);
        }

        return _.map(actions, action => {

            const nbservices = _.size(action.services);

            return (
              <Table.Row key={action.id}>
                  <Table.Cell width={4}>
                      {action.device_model && action.device_model.name}
                      </Table.Cell>
                  <Table.Cell width={3}>
                      {action.command}
                      </Table.Cell>
                  <Table.Cell width={4}>
                      <Label size="mini" basic> /{action.oid}/{action.iid}/{action.rid} </Label>
                  </Table.Cell>
                  <Table.Cell width={2} textAlign="center">
                      <Label size="mini" color={nbservices?'blue':null}> {nbservices} </Label>
                  </Table.Cell>
                  <Table.Cell width={3} textAlign="center">
                      <Button.Group  size='mini' className="inline-compact-button">
                          <Button icon='checkmark' positive={action.activated}
                                  onClick={() => this.props.updateAction(action.id, {activated: !action.activated})}/>
                          <Button icon='pencil'
                                  onClick={() => this.handleEditAction((action.id))}/>
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

        const {selected_element} = this.props;

        return (
          <div>

              <Modal size="small" dimmer={false}
                     open={!!selected_element || this.state.action_modal_open}
                     onClose={(e) => this.onAddActionClose(e)}
                     closeOnDocumentClick
              >
                  <Modal.Header>{selected_element ? 'Edit' : 'Add'} Action</Modal.Header>
                  <Modal.Content>
                      <ActionForm submitRef={submit => this.submit = submit} />
                  </Modal.Content>
                  <Modal.Actions>
                      <Button color='black'
                              onClick={() => this.onAddActionClose()}>
                          Close
                      </Button>
                      <Button positive icon='checkmark' labelPosition='right'
                              content="Save" onClick={() => this.submit()} />
                  </Modal.Actions>
              </Modal>


              <Container>
                  <Header as='h1' block>
                      <Icon name='send' />
                      <Header.Content >
                          Actions
                          <Header.Subheader>
                              Manage actions
                          </Header.Subheader>
                      </Header.Content>
                  </Header>

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
                                  <Button fluid content='Add action'
                                          icon='plus' labelPosition='left'
                                          onClick={() => this.setState({action_modal_open: true})}
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
                              <Table.HeaderCell>Services</Table.HeaderCell>
                              <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
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
        actions: actions.list,
        selected_element: actions.selected
    };
}

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({fetchActions, deleteAction, updateAction}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceModelActions);