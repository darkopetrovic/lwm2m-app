import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/';
import Devices from '../../views/Devices/';
import DeviceDetails from '../../views/DeviceDetails/';
import ObjectsDb from '../../views/ObjectsDb/';
import DeviceModels from "../../views/DeviceModels";
import ResourcesView from "../../views/ObjectsDb/ResourcesView";
import Owners from "../../views/Owners/";

import ApplicationToast from '../../components/Messages/Toasts';

class Full extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        return (
          <div className="app">
              <ApplicationToast/>
              <Header/>
              <div className="app-body">
                  <Sidebar/>

                      <main className="main">
                          <Breadcrumb/>
                          <div className="container-fluid">
                              <Switch>
                                  <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                                  <Route path="/devices/:id" name="Devices" component={DeviceDetails}/>
                                  <Route path="/devices" name="Devices" component={Devices}/>
                                  <Route path="/objectsdb" name="ObjectsDb" component={ObjectsDb}/>
                                  <Route path="/resourcesdb" name="Resources"
                                         component={ResourcesView}/>
                                  <Route path="/devicemodels" name="Device Models"
                                         component={DeviceModels}/>
                                  <Route path="/owners" name="Owners" component={Owners}/>
                                  <Redirect from="/" to="/dashboard"/>
                              </Switch>
                          </div>
                      </main>



                  <Aside/>
              </div>

                <Footer/>
          </div>
        );
    }
}

export default Full;

