import _ from 'lodash';
import React, { Component } from 'react';
import QueuedRequests from "./QueuedRequests";
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import classnames from 'classnames'
import {connect} from "react-redux";


class Aside extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }


  render() {
        const {total_requests} = this.props;

    return (
      <aside className="aside-menu">
        <Nav tabs>
          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>
              <i className="icon-list" />
                {total_requests!==0 && (<span className="badge badge-pill badge-danger">{total_requests}</span>)}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>
              <i className="icon-settings" />
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
              <QueuedRequests />
          </TabPane>
          <TabPane tabId="3" className="p-3">
            <h6>Settings</h6>

            <div className="aside-options">
              <div className="clearfix mt-4">
                <small><b>Option 1</b></small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                  <input type="checkbox" className="switch-input" defaultChecked />
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </label>
              </div>
              <div>
                <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</small>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small><b>Option 2</b></small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                  <input type="checkbox" className="switch-input" />
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </label>
              </div>
              <div>
                <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</small>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small><b>Option 3</b></small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                  <input type="checkbox" className="switch-input" />
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </label>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small><b>Option 4</b></small>
                <label className="switch switch-text switch-pill switch-success switch-sm float-right">
                  <input type="checkbox" className="switch-input" defaultChecked />
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </label>
              </div>
            </div>

            <hr/>
            <h6>System Utilization</h6>


          </TabPane>
        </TabContent>
      </aside>
    )
  }
}

const mapStateToProps = ({devices}) => {
    return {
        total_requests: _.size(devices.queued_req)
    }
};

export default connect(mapStateToProps, null)(Aside);

