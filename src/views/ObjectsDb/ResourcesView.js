import React, {Component} from 'react';

import ResourcesList from "../../components/ObjectsDb/ResourcesList";
import {Grid} from "semantic-ui-react";

class RersourcesView extends Component {

    render() {

        return (
          <div className="animated fadeIn">
              <Grid>
                  <Grid.Row>
                      <Grid.Column className="overflowNone" width={10}>
                          <ResourcesList />
                      </Grid.Column>

                      <Grid.Column width={6}>

                      </Grid.Column>
                  </Grid.Row>
              </Grid>
          </div>
        )
    }
}

export default RersourcesView;
