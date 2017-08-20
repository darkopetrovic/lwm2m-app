import React, {Component} from 'react';

import ObjectsList from "../../components/ObjectsDb/ObjectsList";
import {Grid} from "semantic-ui-react";

class ObjectsDb extends Component {

    render() {

        return (
          <div className="animated fadeIn">
              <Grid>
                  <Grid.Row>
                      <Grid.Column className="overflowNone" width={10}>
                          <ObjectsList />
                      </Grid.Column>

                      <Grid.Column width={6}>

                      </Grid.Column>
                  </Grid.Row>
              </Grid>
          </div>
        )
    }
}

export default ObjectsDb;
