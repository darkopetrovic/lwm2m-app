import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {Dimmer, Dropdown, Icon, Label, Loader, Menu, Table} from "semantic-ui-react";
import {bindActionCreators} from "redux";
import {fetchObjects} from "../../actions/actions_objectdb";

class ObjectsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            nb_elements: 0,
            nb_pages: 0,
            per_page: 10,
            current_page: 0

        };

    }

    componentDidMount() {
        this.props.fetchObjects();
    }

    componentWillReceiveProps(nextProps, nextState, nextContext) {
        const nbele = _.size(nextProps.objects);
        if(nbele){
            this.setState({
                current_page: 1,
                nb_elements: nbele,
                nb_pages: _.ceil(nbele/this.state.per_page)
            });
        }
    }

    getPaginatedItems(items, page) {
        const {per_page} = this.state;
        const offset = (page - 1) * per_page;
        return _.take(_.drop(_.values(items), offset), per_page);
    }


    renderRows(page) {
        if(!page){
            return;
        }

        const {objects} = this.props;
        const paginatedItems = this.getPaginatedItems(objects, page);

        return _.map(paginatedItems, o => {
              return (
                <Table.Row key={o.id}>
                    <Table.Cell>{o.id}</Table.Cell>
                    <Table.Cell>{o.name}</Table.Cell>
                    <Table.Cell>{o.shortname}</Table.Cell>
                </Table.Row>
              );
          }
        );
    }

    onPageChange(page){
        let next_page;
        if(page === '-1'){
            next_page = this.state.current_page - 1;
        } else if (page === '+1') {
            next_page = this.state.current_page + 1;
        } else {
            next_page = page;
        }

        if(next_page <= this.state.nb_pages && next_page >= 1){
            this.setState({current_page: next_page});
        }
    }

    renderPagination(){
        return _.map(_.range(1, this.state.nb_pages+1), i => {
                return (
                  <Menu.Item
                    disabled={this.state.current_page === i}
                    key={i}
                    onClick={(event, props) => this.onPageChange(i)}>{i}
                  </Menu.Item>
                )
            });
    }

    render() {

        const {fetching} = this.props;
        const {current_page} = this.state;

        return (
          <div>
               <Table celled>
                  <Table.Header>
                      <Table.Row>
                          <Table.HeaderCell>ID</Table.HeaderCell>
                          <Table.HeaderCell>Name</Table.HeaderCell>
                          <Table.HeaderCell>Shortname</Table.HeaderCell>
                      </Table.Row>
                  </Table.Header>

                  <Table.Body>
                      <Dimmer active={fetching} inverted>
                          <Loader size='medium'>Loading</Loader>
                      </Dimmer>
                      {this.renderRows(current_page)}
                  </Table.Body>

                  <Table.Footer>
                      <Table.Row>
                          <Table.HeaderCell colSpan='3'>
                              <Menu floated='right' pagination size="mini">
                                  <Menu.Item as='a' icon
                                             disabled={this.state.current_page === 1}
                                             onClick={(event, props) => this.onPageChange('-1')}>
                                      <Icon name='left chevron'/>
                                  </Menu.Item>
                                  {this.renderPagination()}
                                  <Menu.Item as='a' icon
                                             disabled={this.state.current_page === this.state.nb_pages}
                                             onClick={(event, props) => this.onPageChange('+1')}>
                                      <Icon name='right chevron'/>
                                  </Menu.Item>
                              </Menu>
                          </Table.HeaderCell>
                      </Table.Row>
                  </Table.Footer>
              </Table>
          </div>

        );
    }
}

ObjectsTable.propTypes = {};
ObjectsTable.defaultProps = {};

function mapStateToProps({objects}) {
    return {
        objects: objects.list,
        fetching: objects.isFetching
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchObjects}, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(ObjectsTable);
