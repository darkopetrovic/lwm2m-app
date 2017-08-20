import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {
    Button, Divider, Dropdown,
    Header, Icon, Input, Item, Label, Loader, Menu, Modal, Popup, Segment,
} from "semantic-ui-react";
import {bindActionCreators} from "redux";
import {
    fetchObjects, SELECT_OBJECT,
} from "../../actions/actions_objectdb";
import InfiniteScroll from 'react-infinite-scroller';
import Grid from "semantic-ui-react/dist/es/collections/Grid/Grid";
import ObjectForm from "./ObjectForm";
import {getSelectedObject} from "../../selectors/selectors_objects";
import classNames from 'classnames';

import {makeDebugger} from '../../utils/debug';
import {fetchOwners} from "../../actions/actions_owners";
import ObjectsListItem from "./ObjectsListItem";
const debug = makeDebugger('objectslist');

class ObjectsList extends Component {
    constructor(props) {
        super(props);

        const {per_page} = this.props;

        this.state = {
            displayed_data: [],
            filtered_data: [],
            nb_elements: 0,
            nb_pages: 0,
            per_page: per_page,
            current_page: 0,
            hasMoreItems: true,
            fetching: false,
            current_action: null,
            searchTerm: "",
            filter_owner: null,
            form_open: false
        };

        this.getNextItems = this.getNextItems.bind(this);
        this.onSearchInput = this.onSearchInput.bind(this);
        this.onFilterSelect = this.onFilterSelect.bind(this);
        this.clearSearch = this.clearSearch.bind(this);

    }

    componentWillMount() {
        debug('componentWillMount()');
        this.props.fetchObjects();
        this.props.fetchOwners();
    }


    componentDidMount() {
        debug('componentDidMount()');
    }

    componentWillUnmount() {
        debug('componentWillUnmount()');
    }

    componentWillReceiveProps(nextProps, nextState, nextContext) {
        debug('componentWillReceiveProps()', nextProps, nextState);
        const nbele = _.size(nextProps.objects);
        const {per_page} = this.state;

        const newObjectAdded = nbele > _.size(this.props.objects);
        if(nbele && !this.state.displayed_data.length || newObjectAdded){
            // first time, populate filtered_data with all objects
            this.setState({
                nb_elements: nbele,
                nb_pages: _.ceil(nbele/per_page),
                filtered_data: nextProps.objects,
                current_page: 1,
                displayed_data: [],
                form_open: false
            }, this.getNextItems);
        }
    }

    /**
     * Triggered by InfiniteScroll whenever the user scroll down the page.
     * @param page  Incremented by InfiniteScroll each times the bottom of the page is reached
     *              We don't use this variable because we cannot reset its value to 0.
     */
    getNextItems(page) {
        const {current_page} = this.state;
        const {displayed_data, filtered_data, nb_pages} = this.state;
        const {per_page} = this.props;
        const offset = (current_page - 1) * per_page;
        const next_items = _.take(_.drop(_.values(filtered_data), offset), per_page);
        const items = displayed_data.concat(next_items);

        if(current_page===nb_pages){
            this.setState({
                hasMoreItems: false
            });
        }

        debug('getNextItems()', current_page, '/', nb_pages);
        this.setState({
            displayed_data: items,
            current_page: this.state.current_page + 1
        });

    }

    /**
     *
     */
    getFilteredData(){
        const {searchTerm, filter_owner} = this.state;

        debug('getFilteredData()', searchTerm, filter_owner);
        const {per_page} = this.state;
        const {objects} = this.props;
        let results = _.filter(objects, o => {
            if( (_.lowerCase(o.shortname).indexOf(_.lowerCase(searchTerm)) >= 0
              || _.lowerCase(o.name).indexOf(_.lowerCase(searchTerm)) >= 0
              || o.id.indexOf(searchTerm) >= 0)
            ) {
                return o;
            }
        });

        if(filter_owner){
            results = _.filter(results, o => {
                if(o.owner && o.owner.id === filter_owner){
                    return o;
                }
            })
        } else if(filter_owner === 0){
            results = _.filter(results, o => {
                if(o.owner === undefined){
                    return o;
                }
            })
        }

        const nbele = _.size(results);
        this.setState({
            nb_elements: nbele,
            nb_pages: _.ceil(nbele/per_page),
            displayed_data: [],
            filtered_data: results,
            current_page: 1,
            hasMoreItems: !!nbele
        })
    }


    onSearchInput(e, data){
        debug('onSearchInput()', data.value);
        this.setState( {searchTerm: data.value}, this.getFilteredData);
        // keep the rest of the code in separate function
        // in case debouncing is needed with a remote research
    }

    onFilterSelect(e, { value }){
        debug('onFilterSelect()', value);
        this.setState({ filter_owner: value }, this.getFilteredData);
    }

    clearSearch () {
        debug('clearSearch()');
        this.onSearchInput(null, {value: ""});
        this.setState({filter_owner: null});
    }

    onFormClose() {
        this.props.dispatch({
            type: SELECT_OBJECT,
            payload: null
        });
        this.setState({form_open: false})
    }
    //
    // /**
    //  * The Open and Close events of Popups are handled by this function.
    //  * @param event     Event. Can be either 'open' or 'close'
    //  * @param action    Identify the type of the popup. Can be either 'edit_object' or 'view_resources'
    //  * @param id        Object ID to identify the popup itself
    //  */
    // handlePopupActions(event, action, id){
    //     debug('handlePopupActions', event, action, id);
    //     if(event === 'open'){
    //         this.props.setSelectedObject(id);
    //         this.setState({current_action: action, popup_edit_open: true});
    //     } else if (event === 'close'){
    //         if(this.props.selected_object.id === id &&
    //             this.state.current_action === action){
    //             this.props.setSelectedObject(null);
    //             this.setState({current_action: null, popup_edit_open: false});
    //         }
    //     }
    // }

    renderObjects() {
        const {displayed_data} = this.state;
        debug(' - renderObjects()', _.size(displayed_data));

        if(!_.size(displayed_data)){
            return (<div>No results.</div>);
        }

        return _.map(displayed_data, o => {
              return (
                <ObjectsListItem object_key={o.id} key={o.id}/>
              );
          }
        );
    }

    render() {
        debug('render()');

        const {fetching, objects, owners, selected_element} = this.props;
        const {hasMoreItems, searchTerm, filter_owner, nb_elements, form_open} = this.state;

        let list_owner = _.map(owners, o => {
            return {
                text: o.name,
                value: o.id
            }
        });

        list_owner.push({text: 'None', value: 0});

        // () => this.refs.objectForm.getWrappedInstance().submit()

        return (
          <div>
              <Header as='h1' block>
                  <Icon name='cubes' />
                  <Header.Content >
                      Objects
                      <Header.Subheader>
                          LwM2M Objects
                      </Header.Subheader>
                  </Header.Content>
              </Header>

              <Modal size="small" dimmer={false}
                     open={!!selected_element || form_open}
                     onClose={() => this.onFormClose()}
                     closeOnDocumentClick
              >
                  <Modal.Header>{selected_element ? 'Edit' : 'Add'} Object</Modal.Header>
                  <Modal.Content>
                      <ObjectForm submitRef={submit => this.submit = submit} />
                  </Modal.Content>
                  <Modal.Actions>
                      <Button color='black'
                              onClick={() => this.onFormClose()}>
                          Close
                      </Button>
                      <Button positive icon='checkmark' labelPosition='right'
                              content="Save" onClick={() => this.submit()}/>
                  </Modal.Actions>
              </Modal>


              <Segment >
                  <Grid divided='vertically'>
                      <Grid.Row style={{paddingBottom: '0px'}}>
                          <Grid.Column width={8}>
                              <Input fluid icon='search' iconPosition='left'
                                     placeholder='Search...' className="input-search"
                                     loading={false}
                                     onChange={this.onSearchInput}
                                     value={searchTerm}
                              />
                          </Grid.Column>

                          <Grid.Column width={5}>
                              <Dropdown placeholder='Filter by owner'
                                        floating labeled button className='icon'
                                        icon='filter' basic fluid selectOnBlur={false}
                                        value={filter_owner}
                                        onChange={this.onFilterSelect}
                                        options={
                                            list_owner
                                        }
                              />
                          </Grid.Column>

                          <Grid.Column width={3}>
                              <Button fluid content='Clear' icon='eraser'
                                      labelPosition='left'
                                      onClick={e => this.clearSearch()} />
                          </Grid.Column>


                      </Grid.Row>
                      <Grid.Row style={{paddingTop: '0', paddingBottom: '0'}}>
                          <Grid.Column width={12}>
                              <Label basic>
                                  <Icon name='clone' />
                                  Filtered elements
                                  <Label.Detail>{nb_elements}</Label.Detail>
                              </Label>
                          </Grid.Column>

                          <Grid.Column width={4}>
                              <Button fluid content='Add object'
                                      icon='plus' labelPosition='left'
                                      onClick={() => this.setState({form_open: true})}
                              />
                          </Grid.Column>
                      </Grid.Row>
                  </Grid>
              </Segment>


              {!_.size(objects) ? (
                <div>
                    <Loader size='large' inline='centered' active={fetching}>Loading</Loader>
                </div>
              ) : (

                    <InfiniteScroll
                      pageStart={0}
                      loadMore={this.getNextItems.bind(this)}
                      hasMore={hasMoreItems}
                      loader={<Loader size='large' inline='centered' active>Loading</Loader>}
                      threshold={0}
                      initialLoad={true}
                      className={'ui divided items'}
                    >
                        {this.renderObjects()}
                    </InfiniteScroll>

              )}

          </div>
        );
    }
}

ObjectsList.propTypes = {
    per_page: PropTypes.number.isRequired,
    objects: PropTypes.object,
    fetching: PropTypes.bool,
    selected_object: PropTypes.object,
    owners: PropTypes.object
};

ObjectsList.defaultProps = {
    per_page: 10,
    objects: {},
    fetching: false,
    selected_object: {id: null},
    owners : {}
};


function mapStateToProps(state) {
    return {
        objects: state.objects.list,
        fetching: state.objects.isFetching,
        selected_object: getSelectedObject(state),
        owners: state.objects.owners,
        selected_element: state.objects.selected
    };
}

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({fetchObjects, fetchOwners}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectsList);
