import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Button, Header, Icon, Item, Label, Popup, Segment} from "semantic-ui-react";

import {makeDebugger} from '../../utils/debug';
import {deleteObject, SELECT_OBJECT} from "../../actions/actions_objectdb";
import {getObject} from "../../selectors/selectors_objects";
const debug = makeDebugger('objects-list-item');
/**
 * @property {object} object.specific_object
 */

class ObjectsListItem extends Component {
    constructor(){
        super();
    }

    onEditClick(id) {
        this.props.dispatch({
            type: SELECT_OBJECT,
            payload: id
        });
    }

    render() {
        const {object} = this.props;
        debug('render()', this.props);

        if(!object){
            return null
        }

        return (
          <Item  key={object.id} className="object-list-row" >
              <Item.Content>
                  <Segment style={{ width: 100, height: 100 }}
                           floated='left' textAlign="center">
                      <Header as='h2'>
                          {object.id}
                          <Header.Subheader>
                              <Icon name='cube' size="big" color="grey"/>
                          </Header.Subheader>
                      </Header>
                  </Segment>
                  <Item.Header as='a'>{object.name || object.shortname}</Item.Header>
                  <Item.Meta>
                      <span className='cinema'>{object.shortname}</span>
                  </Item.Meta>
                  <Item.Description>
                      {object.description || "Please add a description"}
                  </Item.Description>
                  <Item.Extra>
                      {/* Using the raw html code for the button because the
                            Semantic Button Component perform bad here
                            (because there is multiple button?) */}


                      <Button.Group style={{display: 'inline-block' }} size='mini' floated="right">
                          <Button icon='pencil' onClick={()=> this.onEditClick(object.id)} />
                          <Button icon='delete' onClick={() => this.props.deleteObject(object.id)} />
                      </Button.Group>


                      {/*<Button.Group size='mini' floated="right">*/}

                          {/*<Button icon='delete' />*/}

                          {/*<Popup*/}
                            {/*trigger={*/}
                                {/*<Button icon='pencil' className={editBtnClass} />*/}
                            {/*}*/}
                            {/*on='click'*/}
                            {/*position='bottom center'*/}
                            {/*className="popup-object-edit"*/}
                            {/*open={this.props.selected_object.id===object.id && current_action === 'edit_object' }*/}
                            {/*onClose={() => this.handlePopupActions('close', 'edit_object', object.id)}*/}
                            {/*onOpen={() => this.handlePopupActions('open', 'edit_object', object.id)}*/}
                          {/*>*/}
                              {/*<Popup.Header as="h3">Edit object</Popup.Header>*/}
                              {/*<Popup.Content>*/}
                                  {/*<ObjectEdit />*/}
                              {/*</Popup.Content>*/}
                          {/*</Popup>*/}


                          {/*<Popup*/}
                            {/*trigger={*/}
                                {/*<Button icon='table' className={resourcesBtnClass} />*/}
                            {/*}*/}
                            {/*on='click'*/}
                            {/*position='right center'*/}
                            {/*className="resources-popup-container"*/}
                            {/*open={this.props.selected_object.id===object.id && current_action === 'view_resources' }*/}
                            {/*onClose={() => this.handlePopupActions('close', 'view_resources', object.id)}*/}
                            {/*onOpen={() => this.handlePopupActions('open', 'view_resources', object.id)}*/}
                          {/*>*/}
                              {/*<Popup.Header as="h3">Resources list</Popup.Header>*/}
                              {/*<Popup.Content>*/}
                                  {/*<ResourcesList per_page="5"/>*/}
                              {/*</Popup.Content>*/}
                          {/*</Popup>*/}

                      {/*</Button.Group>*/}

                      <Popup
                        trigger={<Label><Icon name='user' />{object.owner && object.owner.name}</Label>}
                        content='Owner' />

                      <Popup
                        trigger={<Label><Icon name='mail' />56</Label>}
                        content='Number of resources' />



                  </Item.Extra>
              </Item.Content>
          </Item>
        );
    }
}

ObjectsListItem.propTypes = {};
ObjectsListItem.defaultProps = {};

function mapStateToProps(state, props) {
    return {
        object: getObject(state, props)
    };
}

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({deleteObject}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectsListItem);