import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    Segment, Label, Container, Table, Icon, Header, Grid, Input,
    Dropdown, Button, Modal
} from "semantic-ui-react";
import {makeDebugger} from '../../utils/debug';
import {
    addOwner, deleteOwner, fetchOwners, SELECT_OWNER,
    updateOwner
} from "../../actions/actions_owners";
import OwnerForm from "./OwnerForm";

const debug = makeDebugger('devicemodel-owners');

/**
 * @property {object} this.refs.actionForm
 *
 */
class Owners extends Component {

    constructor(){
        super();

        this.state = {
            form_open: false
        };

        this.onEditOwner = this.onEditOwner.bind(this);

    }




    componentWillMount() {
        this.props.fetchOwners();
    }

    componentWillReceiveProps(nextProps, nextState, nextContext) {
        debug('componentWillReceiveProps()', nextProps, nextState);
        const nbele = _.size(nextProps.owners);
        const newObjectAdded = nbele > _.size(this.props.owners);
        if(newObjectAdded){
            this.setState({
                form_open: false
            });
        }
    }

    onAddOwnerClose = () => this.setState({form_open: false});

    onEditOwner(id){
        this.props.dispatch({
           type: SELECT_OWNER,
           payload: id
        });
    }

    renderOwners() {
        const {owners} = this.props;

        if(!_.size(owners)){
            return(<Table.Row><Table.Cell>No owners</Table.Cell></Table.Row>);
        }

        return _.map(owners, owner => {
            return (
              <Table.Row key={owner.id}>
                  <Table.Cell width={12}>{owner.name}</Table.Cell>
                  <Table.Cell width={4}>
                      <Button.Group  size='mini' className="inline-compact-button">
                          <Button icon='pencil'
                                  onClick={() => this.onEditOwner(owner.id)}/>
                          <Button icon='delete'
                                  onClick={() => this.props.deleteOwner(owner.id)}/>
                      </Button.Group>
                  </Table.Cell>
              </Table.Row>
            );
        });
    }

    render() {
        debug('render()', this.props.owners);

        const {selected_element} = this.props;

        return (
          <div>

              <Modal size="small" dimmer={false}
                     open={!!selected_element || this.state.form_open}
                     onClose={this.onAddOwnerClose}
                     closeOnDocumentClick
              >
                  <Modal.Header>Add Owner</Modal.Header>
                  <Modal.Content>
                      <OwnerForm submitRef={submit => this.submit = submit}  />
                  </Modal.Content>
                  <Modal.Actions>
                      <Button color='black'
                              onClick={() => this.setState({form_open: false})}>
                          Close
                      </Button>
                      <Button positive icon='checkmark' labelPosition='right'
                              content="Add owner" onClick={() => this.submit()}/>
                  </Modal.Actions>
              </Modal>


              <Container>
                  <Header as='h1' block>
                      <Icon name='user' />
                      <Header.Content >
                          Owners
                          <Header.Subheader>
                              Manage owners
                          </Header.Subheader>
                      </Header.Content>
                  </Header>

                  <Segment>
                      <Grid columns={1}>
                          <Grid.Row>
                              <Grid.Column>
                                  <Button fluid content='Add owner'
                                          icon='plus' labelPosition='left'
                                          onClick={() => this.setState({form_open: true})}
                                  />
                              </Grid.Column>
                          </Grid.Row>

                      </Grid>
                  </Segment>

                  <Table celled size='small'>
                      <Table.Header>
                          <Table.Row>
                              <Table.HeaderCell>Name</Table.HeaderCell>
                              <Table.HeaderCell>Actions</Table.HeaderCell>
                          </Table.Row>
                      </Table.Header>

                      <Table.Body>
                          {this.renderOwners()}
                      </Table.Body>
                  </Table>
              </Container>
          </div>
        );
    }


}

Owners.propTypes = {};
Owners.defaultProps = {};

function mapStateToProps(state) {
    return {
        owners: state.owners.list,
        fetching: state.owners.isFetching,
        selected_element: state.owners.selected
    };
}

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({fetchOwners, addOwner, deleteOwner, updateOwner}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Owners);