import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Button, Header, Icon, Item, Label, Popup, Segment} from "semantic-ui-react";

import {makeDebugger} from '../../utils/debug';
import {getResource} from "../../selectors/selectors_resources";
import {deleteResource, SELECT_RESOURCE} from "../../actions/actions_objectdb";
const debug = makeDebugger('resources-list-item');
/**
 * @property {object} resource.specific_object
 */

class ResourcesListItem extends Component {
    constructor(){
        super();
    }

    onEditResourceClick(id) {
        this.props.dispatch({
            type: SELECT_RESOURCE,
            payload: id
        });
    }

    render() {
        const {resource} = this.props;
        debug('render()', this.props);

        if(!resource){
            return null;
        }

        let resourceClass = null;
        if(resource.id <= 2047){
            resourceClass = {name: 'Common', id: 'C', color: 'grey'};
        } else if (resource.id >= 2048 && resource.id <= 26240 ) {
            resourceClass = {name: 'Reusable', id: 'R', color: 'teal'};
        } else {
            resourceClass = {name: 'Private', id: 'P', color: 'violet'};
        }

        const accessType = [
            {name: 'Read', id: 'R'},
            {name: 'Write', id: 'W'},
            {name: 'Read/Write', id: 'RW'},
            {name: 'Execute', id: 'E'}
        ];
        
        return (
          <Item  key={resource.enhanced_id} className="object-list-row" >
              <Item.Content>
                  <Segment style={{ width: 100, height: 100 }}
                           floated='left' textAlign="center">
                      <Header as='h2'>
                          {resource.id}
                          <Header.Subheader>
                              <Icon name='cube' size="big" color="grey"/>
                          </Header.Subheader>
                      </Header>
                  </Segment>
                  <Item.Header as='a'>{resource.name || resource.shortname}</Item.Header>
                  <Item.Meta>
                      <span className='cinema'>{resource.shortname}</span>
                  </Item.Meta>
                  <Item.Description>
                      {resource.description || "Please add a description"}
                  </Item.Description>
                  <Item.Extra>

                      <Button.Group style={{display: 'inline-block' }} size='mini' floated="right">
                          <Button icon='pencil' onClick={()=> this.onEditResourceClick(resource.enhanced_id)} />
                          <Button icon='delete' onClick={() => this.props.deleteResource(resource.enhanced_id)}/>
                      </Button.Group>


                      <Popup style={{display: 'inline-block' }}
                             trigger={
                                 <Label size="tiny" color={resourceClass.color}>
                                     <Icon name='trophy' />{resourceClass.id}
                                 </Label>
                             }
                             content={`ResourceID Class: ${resourceClass.name}`} />

                      { resource.specific_object &&
                      <Popup
                        trigger={
                            <Label size="tiny">
                                <Icon name='cube' />
                                {resource.specific_object && resource.specific_object.id}
                            </Label>}
                      >
                          Belong to object: <b>
                          {resource.specific_object && (resource.specific_object.name || resource.specific_object.shortname)}</b>
                      </Popup>
                      }

                      {resource.access &&
                      <Popup style={{display: 'inline-block' }}
                             trigger={<Label size="tiny"><Icon name='privacy' />{resource.access}</Label>}
                             content={`Access type: ${_.find(accessType, {id: resource.access}).name}`} />
                      }


                      <Popup style={{display: 'inline-block' }}
                             trigger={<Label size="tiny"><Icon name='code' />{resource.type}</Label>}
                             content='Type' />

                      <Label.Group size="mini" tag style={{display: 'inline-block' }}>
                          {resource.multiple && <Label color="violet">MI</Label>}
                          {resource.mandatory && <Label color="red">M</Label>}
                          {resource.range && <Label>{resource.range}</Label>}
                          {resource.units && <Label>{resource.units}</Label>}
                      </Label.Group>

                  </Item.Extra>
              </Item.Content>
          </Item>
        );
    }
}

ResourcesListItem.propTypes = {};
ResourcesListItem.defaultProps = {};

function mapStateToProps(state, props) {
    return {
        resource: getResource(state, props)
    };
}

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({deleteResource}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourcesListItem);