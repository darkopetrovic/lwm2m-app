import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {
    Button, Checkbox, Container, Divider, Dropdown,
    Header, Icon, Input, Item, Label, Loader, Menu, Modal, Popup, Segment,
} from "semantic-ui-react";
import {bindActionCreators} from "redux";
import {
    fetchResources, SELECT_RESOURCE,
} from "../../actions/actions_objectdb";
import InfiniteScroll from 'react-infinite-scroller';
import Grid from "semantic-ui-react/dist/es/collections/Grid/Grid";

import {makeDebugger} from '../../utils/debug';
import ResourceForm from "./ResourceForm";
import ResourcesListItem from "./ResourcesListItem";
const debug = makeDebugger('resources-list');

/**
 * @property {object} this.refs.resourceForm
 *
 */

class ResourcesList extends Component {
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
            filter_object: null,
            filter_class: null,
            filter_mandatory: false,
            filter_multiple: false,
            edit_resource_open: false,
        };

        this.getNextItems = this.getNextItems.bind(this);
        this.onSearchInput = this.onSearchInput.bind(this);
        this.onFilterObjectChange = this.onFilterObjectChange.bind(this);
        this.onFilterClassesChange = this.onFilterClassesChange.bind(this);
        this.clearSearch = this.clearSearch.bind(this);


    }

    componentWillMount() {
        debug('componentWillMount()');
        this.props.fetchResources();
    }


    componentDidMount() {
        debug('componentDidMount()');
    }

    componentWillUnmount() {
        debug('componentWillUnmount()');
    }

    componentWillReceiveProps(nextProps, nextState, nextContext) {
        debug('componentWillReceiveProps()', nextProps, nextState);
        const nbele = _.size(nextProps.resources);
        const {per_page} = this.state;

        const newObjectAdded = nbele > _.size(this.props.resources);

        console.log("newObjectAdded", newObjectAdded)

        if(nbele && !this.state.displayed_data.length || newObjectAdded){
            // first time, populate filtered_data with all resources
            this.setState({
                nb_elements: nbele,
                nb_pages: _.ceil(nbele/per_page),
                filtered_data: nextProps.resources,
                current_page: 1,
                displayed_data: [],
                edit_resource_open: false
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

        debug('getNextItems()', current_page, '/', nb_pages, filtered_data);
        this.setState({
            displayed_data: items,
            current_page: this.state.current_page + 1
        });

    }

    /**
     *
     */
    getFilteredData(){
        const {searchTerm, filter_object, filter_class,
            filter_mandatory, filter_multiple
        } = this.state;

        debug('getFilteredData()', searchTerm, filter_object);
        const {per_page} = this.state;
        const {resources} = this.props;
        let results = _.filter(resources, r => {
            if( (_.lowerCase(r.shortname).indexOf(_.lowerCase(searchTerm)) >= 0
                || _.lowerCase(r.name).indexOf(_.lowerCase(searchTerm)) >= 0
                || r.id.indexOf(searchTerm) >= 0)
            ) {
                return r;
            }
        });

        if(filter_class){
            const range = filter_class.split(',');
            results = _.filter(results, r => {
                if(r.id >= parseInt(range[0]) && r.id <= parseInt(range[1])){
                    return r;
                }
            })
        }

        if(filter_object){
            results = _.filter(results, r => {
                if(r.specific_object && r.specific_object.id === filter_object){
                    return r;
                }
            })
        }

        if(filter_mandatory){
            results = _.filter(results, r => {
                if(r.mandatory){
                    return r;
                }
            })
        }

        if(filter_multiple){
            results = _.filter(results, r => {
                if(r.multiple){
                    return r;
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

    onFilterClassesChange(e, { value }){
        debug('onFilterClassesChange()', value);
        this.setState({ filter_class: value }, this.getFilteredData);
    }

    onFilterObjectChange(e, { value }){
        debug('onFilterObjectChange()', value);
        this.setState({ filter_object: value }, this.getFilteredData);
    }

    onFilterMandadory(){
        debug('onFilterMandadory()');
        this.setState({ filter_mandatory: !this.state.filter_mandatory }, this.getFilteredData);
    }

    onFilterMultiple(){
        debug('onFilterMultiple()');
        this.setState({ filter_multiple: !this.state.filter_multiple }, this.getFilteredData);
    }

    clearSearch () {
        debug('clearSearch()');
        this.onSearchInput(null, {value: ""});
        this.setState({
            filter_object: null,
            filter_class: null,
            filter_mandatory: null,
            filter_multiple: null
        });
    }

    onEditResourceClose() {
        this.props.dispatch({
            type: SELECT_RESOURCE,
            payload: null
        });
        this.setState({edit_resource_open: false});
    }

    renderResources() {
        const {displayed_data} = this.state;
        debug(' - renderResources()', displayed_data);

        if(!_.size(displayed_data)){
            return (<div>No results.</div>);4
        }

        return _.map(displayed_data, r => {
              // TODO: use the key instead of enhanced_id
              return (
                <ResourcesListItem resource_key={r.enhanced_id} key={r.enhanced_id}/>
              );
          }
        );
    }

    render() {
        debug('render()');

        const {fetching, resources, selected_element} = this.props;
        const {
            hasMoreItems, searchTerm, nb_elements,
            filter_class, filter_object, filtered_data, edit_resource_open
        } = this.state;

        const resources_classes = [
            {key: 0, text: 'Common', value: '0,2047'},
            {key: 1, text: 'Reusable', value: '2048,26240'},
            {key: 2, text: 'Private', value: '26241,32768'}
        ];

        let filter_objects = [];
        let classes_counter = {
            common: 0,
            reusable: 0,
            private: 0,
        };


        _.each(resources, resource => {

            // create the 'Filter by objects' Dropdown
            if(resource.specific_object && !_.find(filter_objects, {value: resource.specific_object.id})){
                filter_objects.push({
                    key: resource.specific_object.shortname,
                    text: resource.specific_object.name || resource.specific_object.shortname,
                    value: resource.specific_object.id
                });
            }
        });

        _.each(filtered_data, resource => {
            // Count how many resources in each classes
            if(resource.id <= 2047){
                classes_counter.common += 1;
            } else if (resource.id >= 2048 && resource.id <= 26240 ) {
                classes_counter.reusable += 1;
            } else {
                classes_counter.private += 1;
            }
        });

        return (
          <div>
              <Header as='h1' block>
                  <Icon name='tasks' />
                  <Header.Content >
                      Resources
                      <Header.Subheader>
                          LwM2M Resources
                      </Header.Subheader>
                  </Header.Content>
              </Header>

              <Modal size="small" dimmer={false}
                     open={!!selected_element || edit_resource_open}
                     onClose={() => this.onEditResourceClose()}
                     closeOnDocumentClick
              >
                  <Modal.Header>{selected_element ? 'Edit' : 'Add'} Resource</Modal.Header>
                  <Modal.Content>
                      <ResourceForm submitRef={submit => this.submit = submit} />
                  </Modal.Content>
                  <Modal.Actions>
                      <Button color='black'
                              onClick={() => this.onEditResourceClose()}>
                          Close
                      </Button>
                      <Button positive icon='checkmark' labelPosition='right'
                              content="Save"  onClick={() => this.submit()}/>
                  </Modal.Actions>
              </Modal>


              <Segment >
                  <Grid >
                      <Grid.Row style={{paddingBottom: '0'}}>
                          <Grid.Column width={8}>
                              <Input fluid icon='search' iconPosition='left'
                                     placeholder='Search...' className="input-search"
                                     loading={false}
                                     onChange={this.onSearchInput}
                                     value={searchTerm}
                              />
                          </Grid.Column>

                          <Grid.Column width={5}>
                              <Dropdown placeholder='Filter by classes'
                                        floating labeled button className='icon'
                                        icon='trophy' basic fluid selectOnBlur={false}
                                 value={filter_class}
                                        onChange={this.onFilterClassesChange}
                                options={resources_classes}
                              />
                          </Grid.Column>

                          <Grid.Column width={3}>
                              <Button fluid content='Clear' icon='eraser'
                                      labelPosition='left'
                                      onClick={e => this.clearSearch()} />
                          </Grid.Column>

                      </Grid.Row>

                      <Grid.Row style={{paddingBottom: '0'}} >
                          <Grid.Column width={6}>
                              <Dropdown placeholder='Filter by objects'
                                        floating labeled button className='icon'
                                        icon='cubes' basic fluid selectOnBlur={false}
                                        value={filter_object}
                                        onChange={this.onFilterObjectChange}
                                        options={filter_objects}
                              />
                          </Grid.Column>

                          <Grid.Column width={10} verticalAlign="middle">
                              <Checkbox label='Mandatory' checked={this.state.filter_mandatory}
                                        onChange={() => this.onFilterMandadory()}/> &nbsp;&nbsp;
                              <Checkbox label='Multiple Instance' checked={this.state.filter_multiple}
                                        onChange={() => this.onFilterMultiple()}/>
                          </Grid.Column>
                      </Grid.Row>


                      <Grid.Row>
                          <Grid.Column width={12}>

                              <Label.Group size='mini'>
                                  <Label basic>
                                      <Icon name='clone' />
                                      Total
                                      <Label.Detail>{nb_elements}</Label.Detail>
                                  </Label>

                                  <Label color="grey">
                                      <Icon name='trophy' /> Common
                                      <Label.Detail>{classes_counter.common}</Label.Detail>
                                  </Label>

                                  <Label color="teal">
                                      <Icon name='trophy' /> Reusable
                                      <Label.Detail>{classes_counter.reusable}</Label.Detail>
                                  </Label>

                                  <Label color="violet">
                                      <Icon name='clone' /> Private
                                      <Label.Detail>{classes_counter.private}</Label.Detail>
                                  </Label>
                              </Label.Group>
                          </Grid.Column>

                          <Grid.Column width={4}>
                              <Button fluid content='Add resource'
                                      icon='plus' labelPosition='left'
                                      onClick={() => this.setState({edit_resource_open: true})}
                              />
                          </Grid.Column>

                      </Grid.Row>
                  </Grid>
              </Segment>


              {!_.size(resources) ? (
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
                    {this.renderResources()}
                </InfiniteScroll>

              )}

          </div>
        );
    }


}

ResourcesList.propTypes = {
    per_page: PropTypes.number.isRequired,
    resources: PropTypes.object,
    fetching: PropTypes.bool,
    selected_element: PropTypes.string
};

ResourcesList.defaultProps = {
    per_page: 10,
    resources: {},
    fetching: false,
    selected_element: null
};


function mapStateToProps(state) {
    return {
        resources: state.resources.list,
        fetching: state.resources.isFetching,
        selected_element: state.resources.selected
    };
}

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({fetchResources}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourcesList);
