import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {
    Button,
    Grid, List,
    Header, Icon, Item, Label, Loader, Menu, Popup, Segment,
    Table, Dropdown, Input, Message, Divider, Container
} from "semantic-ui-react";
import {bindActionCreators} from "redux";
import {fetchResources} from "../../actions/actions_objectdb";

import {makeDebugger} from '../../utils/debug';
const debug = makeDebugger('device-objectresourcelist');

class ResourcesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            nb_elements: 0,
            nb_pages: 0,
            per_page: this.props.per_page,
            current_page: 0,
            hasMoreItems: true,
            resourceSelectorValue: null
        };
        this.getNextItems = _.throttle(this.getNextItems, 200);
    }

    componentDidMount() {
        this.props.fetchResources();
    }

    componentWillReceiveProps(nextProps, nextState, nextContext) {
        const nbele = _.size(nextProps.resources);
        const {per_page} = this.state;
        if(nbele && !this.state.data.length){
            this.setState({
                nb_elements: nbele,
                nb_pages: _.ceil(nbele/per_page)
            });
        }
    }

    getNextItems(page) {
        const {data, nb_pages} = this.state;
        const {resources, per_page} = this.props;
        const offset = (page - 1) * per_page;
        const new_items = _.take(_.drop(_.values(resources), offset), per_page);
        const items = data.concat(new_items);

        if(page===nb_pages){
            this.setState({
                hasMoreItems: false
            });
        }

        this.setState({
            data: items,
            current_page: page
        });
    }

    renderObjects() {
        const {resources} = this.props;

        return _.map(resources, o => {
              return (
                <Table.Row key={o.id}>
                    <Table.Cell collapsing verticalAlign='middle'>
                        <Icon circular size='large'  name="users" />
                    </Table.Cell>
                    <Table.Cell verticalAlign='middle'>
                        {o.name || o.shortname}
                        </Table.Cell>
                    <Table.Cell verticalAlign='middle' textAlign="right">
                        <Button.Group size='mini'>
                            <Menu size="mini">
                                <Dropdown text='Actions' floating className='actions_dropdown link item'>
                                    <Dropdown.Menu>
                                        <Dropdown.Item icon='edit' text='Edit' />
                                        <Dropdown.Item icon='delete' text='Delete' className="text-danger"/>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu>
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
              );
          }
        );
    }


    handleSearch (list, query) {
        return _.filter(list, e => {
            if(_.lowerCase(e.text).indexOf(_.lowerCase(query)) >= 0
              || e.value.indexOf(query) >= 0
            ) {
                return e;
            }
        });
    }

    handleChange = (e, { value }) => this.setState({ resourceSelectorValue: value });

    handleAddResources(e) {
        this.setState({ resourceSelectorValue: null })
    }

    render() {
        debug('render()');
        const {fetching, resources} = this.props;
        const {hasMoreItems, resourceSelectorValue} = this.state;

        if(!this.props.selectedObject){
            return (<div></div>);
        }

        if(!_.size(resources)){
            return (
              <div style={{width: "500px"}}>
                  <Loader size='medium' active={fetching}>Loading</Loader>
              </div>

            );
        }

        return (
          <div>

              <Message size='tiny'>
                  <Message.Header>You are eligible for a reward</Message.Header>
                  <p>Go to your <b>special offers</b> page to see now.</p>

                  <Button.Group fluid basic className="add-resource-selector">
                      <Dropdown
                        className='icon'
                        icon='plus'
                        button
                        labeled
                        style={{width: "300px"}}
                        search={this.handleSearch}
                        onChange={this.handleChange}
                        searchInput={{ type: 'text' }}
                        selectOnBlur={false}
                        options={
                            _.map(resources, r => {
                                return {
                                    key: r.id,
                                    text: r.shortname + ' ('+r.id+')',
                                    value: r.id,
                                    label: { color: 'grey', empty: true, circular: true }
                                }
                            })
                        }
                        placeholder='Select a resource'
                        value={resourceSelectorValue}
                      />
                      <Button
                        onClick={event => this.handleAddResources(event)}
                      >Add</Button>
                  </Button.Group>
              </Message>

              <Divider />
              <Segment className="no-shadow resources-container">
                  <Table basic="very">
                      <Table.Body>
                            {this.renderObjects()}
                      </Table.Body>
                  </Table>
              </Segment>

          </div>
        );
    }
}

ResourcesList.propTypes = {};
ResourcesList.defaultProps = {};

function mapStateToProps({objects, resources}) {
    return {
        resources: resources.list,
        fetching: resources.isFetching,
        selectedObject: objects.selectedObject
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchResources}, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(ResourcesList);
