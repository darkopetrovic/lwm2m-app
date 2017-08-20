import _ from 'lodash';
import React, { Component } from "react";
import { connect } from "react-redux";
import { Tab } from 'semantic-ui-react'
import { createSelector } from 'reselect'
import ObjectList from './ObjectsList';

import {makeDebugger} from '../../utils/debug';
const debug = makeDebugger('device-tabsobjects');

class TabsObjects extends Component {
    constructor(props) {
        super(props);

        this.panes = [];
        this.state = {
            activeTab: 0
        };
    }

    render() {
        debug("render()");

        this.tabs = [];
        const { device_objects_id, objects } = this.props;

        if (!device_objects_id || !objects) {
            return <div>Loading...</div>;
        }


        // Group device's objects into separate tabs
        _.map(device_objects_id, oid => {

            // find the device's object inside the general objects list
            // to find the owner of the object
            let obj = _.find(objects, {id: oid.toString()});

            if(obj){
                // Search if owner isn't already in the tabs configuration
                if(!_.find(this.panes, {id: obj.owner.id})){
                    this.panes.push({
                        id: obj.owner.id,
                        menuItem: {
                            key: obj.owner.id,
                            icon: 'factory',
                            content: obj.owner.name
                        },
                        objects_ids: []
                    });
                }

                let tab = _.find(this.panes, {id: obj.owner.id});
                tab.objects_ids.push(parseInt(obj.id));
            } else {
                // this is an unknow object => create the Unknow tab
                if(!_.find(this.panes, {id: 'unknow'})) {
                    this.panes.push({
                        id: 'unknow',
                        menuItem: {
                            key: 'unknow',
                            icon: 'question',
                            content: 'Unknow'
                        },
                        objects_ids: []
                    });
                }
                let tab = _.find(this.panes, {id: 'unknow'});
                tab.objects_ids.push(parseInt(oid));
            }
        });

        _.each(this.panes, pane => {
            pane.render = () => <ObjectList selected_objects_ids={pane.objects_ids}/>
        });

        debug('Rendered tabs:', this.panes);

        return (
          <div>
              <Tab menu={{ pointing: true }} panes={this.panes} />
          </div>
        );
    }
}

const getObjectsTabs = createSelector (
  state => state.devices.active.objects_id,
  state => state.objects.list,
  (device_objects_id, objects) => {
      return {
          device_objects_id: device_objects_id,
          objects: objects
      };
  }
);


const mapStateToProps = (state) => {
    if(!state.devices.active){
        return;
    }
    return getObjectsTabs(state);
};

export default connect(mapStateToProps)(TabsObjects);



