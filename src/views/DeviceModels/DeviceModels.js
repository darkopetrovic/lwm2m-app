import React, {Component} from 'react';
import ObjectsList from "../../components/ObjectsDb/ObjectsList";
import {Grid} from "semantic-ui-react";
import DeviceModelsList from "../../components/DeviceModels/DeviceModelsList";
import DeviceModelActions from "../../components/DeviceModels/DeviceModelActions";

class DeviceModels extends Component {

    render() {

        return (
          <div className="animated fadeIn">
              <Grid>
                  <Grid.Row>
                      <Grid.Column width={6}>
                          <DeviceModelsList />
                      </Grid.Column>

                      <Grid.Column width={10}>
                            <DeviceModelActions />
                      </Grid.Column>
                  </Grid.Row>
              </Grid>
          </div>
        )
    }
}

export default DeviceModels;
