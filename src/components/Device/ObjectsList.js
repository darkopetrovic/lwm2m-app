import _ from "lodash";
import React, { Component } from "react";
import Masonry from 'react-masonry-component';
import ObjectCard from './ObjectCard';
import { connect } from "react-redux";

import { createSelector } from 'reselect';

import {makeDebugger} from '../../utils/debug';
const debug = makeDebugger('device-objectslist');

const masonryOptions = {
    transitionDuration: 400,
    stagger: 30
};

class ObjectsList extends Component {
    constructor(props){
        super(props);

        this.state = {
            width: 0
        };

        this.update = this.update.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    componentDidMount() {
        const width = this.divElement.clientWidth;
        console.log("width", width);
        this.setState({ width });

        window.addEventListener("resize", this.onWindowResize);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        debug('componentWillReceiveProps()', this.props, nextProps);
        setTimeout(()=>{
            const width = this.divElement.clientWidth;
            this.setState({ width });
            console.log('this.divElement.clientWidth', this.divElement.clientWidth);
        }, 200);
    }


    update(){
        this.forceUpdate();
    }

    onWindowResize(){
        if(this.divElement) {
            setTimeout(() => {
                this.setState({width: this.divElement.clientWidth});
            }, 200);
        }
    }

    renderList() {
        let width = '50%';
        if(this.state.width < 650){
            width = '100%'
        }
        return _.map(this.props.objects_list, object => {
            return (
              <div className="object-grid-item" style={{width}}
                   key={object.id + '-' + object.instance_id}>
                  <ObjectCard object={object} callback={this.update}/>
              </div>
            );
        });
    }

    render () {
        debug('render()', this.props.objects_list);

        return (
          <div ref={ (divElement) => this.divElement = divElement}>
              <Masonry
                //ref={function(c) {this.masonry = this.masonry || c.masonry;}.bind(this)}
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
        return {
            objects_list: getObjectsList(state, props),
            left_side_bar_open: state.layout.left_side_bar_open,
            right_side_bar_open: state.layout.right_side_bar_open
        };
    };
};

export default connect(mapStateToProps)(ObjectsList);