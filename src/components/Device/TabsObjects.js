import _ from 'lodash';
import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from 'classnames';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

import ObjectList from './ObjectsList';

class TabsObjects extends Component {
    constructor(props) {
        super(props);

        this.tabs = [];

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: 0
        };
    }


    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    renderTabsNav(){
        return _.map(this.tabs, (tab, i) => {
            return (
              <NavItem key={i}>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === i })}
                    onClick={() => { this.toggle(i); }}
                  >
                      <i className={tab.icon} /> {tab.title} &nbsp;
                  </NavLink>
              </NavItem>
            );
        });
    }

    renderTabsContent(){
        return _.map(this.tabs, (tab, i) => {
            return (
              <TabPane tabId={i} key={i}>
                  <ObjectList objects={tab.objects}/>
              </TabPane>
            );
        });
    }


    render() {
        this.tabs = [];
        const { device, objects } = this.props;

        if (!device || !objects) {
            return <div>Loading...</div>;
        }


        // Group device's objects into separate tabs
        _.map(device.objects, object => {

            // find the device's object inside the global objects array
            // to find the owner of the object
            let obj = _.find(objects, {id: object.id.toString()});

            if(obj){
                // Search if owner isn't already in the tabs configuration
                if(!_.find(this.tabs, {id: obj.owner.id})){
                    this.tabs.push({
                        id: obj.owner.id,
                        title: obj.owner.name,
                        icon: 'icon-basket-loaded',
                        objects: []
                    })
                }

                let tab = _.find(this.tabs, {id: obj.owner.id});

                // create new object to not mutate the state
                const nobj = Object.assign({}, object);

                // Create one object per instance
                _.each(nobj.instances, inst => {
                    nobj.resources = inst.resources;
                    nobj.instanceId = inst.id;
                    tab.objects.push(nobj)
                });

            }


        });

        return (
          <div>
              <Nav tabs>
                  {this.renderTabsNav()}
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                  {this.renderTabsContent()}
              </TabContent>
          </div>
        );
    }
}

function mapStateToProps({devices, objects}) {
    return {
        device: devices.active,
        objects: objects
    };
}

export default connect(mapStateToProps)(TabsObjects);



