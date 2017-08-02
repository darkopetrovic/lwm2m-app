import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/';
import Devices from '../../views/Devices/';
import DeviceDetails from '../../views/DeviceDetails/';

class Full extends Component {
    render() {
        return (
          <div className="app">
            <Header />
            <div className="app-body">
              <Sidebar {...this.props}/>
              <main className="main">
                <Breadcrumb />
                <div className="container-fluid">
                  <Switch>
                    <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                    <Route path="/devices/:id" name="Devices" component={DeviceDetails}/>
                    <Route path="/devices" name="Devices" component={Devices}/>
                    <Redirect from="/" to="/dashboard"/>
                  </Switch>
                </div>
              </main>
              <Aside />
            </div>
            <Footer />
          </div>
        );
    }
}

export default Full;
