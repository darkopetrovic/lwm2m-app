import _ from "lodash";
import React, { Component } from "react";
import Masonry from 'react-masonry-component';
import ObjectCard from './ObjectCard';
import { connect } from "react-redux";

import { createSelector } from 'reselect';

import {makeDebugger} from '../../utils/debug';
const debug = makeDebugger('device-objectslist');

const masonryOptions = {
    transitionDuration: 500
};

class ObjectsList extends Component {
    constructor(props){
        super(props)
        this.update = this.update.bind(this);
    }

    update(){
        this.forceUpdate();
    }

    renderList() {
        return _.map(this.props.objects_list, object => {
            return (
              <div className="object-grid-item" key={object.id + '-' + object.instance_id}>
                  <ObjectCard object={object} callback={this.update}/>
              </div>

            );
        });
    }


    render () {
        debug('render');
        return (
          <div>
              <Masonry
                className={''} // default ''
                elementType={'div'} // default 'div'
                options={masonryOptions} // default {}
              >
                  {this.renderList()}
              </Masonry>
          </div>
        )
    }
}

/**
 * Props selected_objects_ids: list of selected objects by the tab, e.g: [1, 3, 3303, ...]
 */
const makeGetObjectsList = () => createSelector (
  (state, props) => props.selected_objects_ids,
  (state) => state.devices.active.objects,
  (objects_ids, device_objects) => {
      return _.reduce(device_objects, function(results, obj) {
          // look throught device's objects and find that who were selected by the tab
          if(_.includes(objects_ids, obj.id)){
              results.push( obj );
          }
          return results;
      }, []);

  }
);

const mapStateToProps = () => {
    const getObjectsList = makeGetObjectsList();
    return (state, props) => {
        return {objects_list: getObjectsList(state, props)};
    };
};

export default connect(mapStateToProps)(ObjectsList);