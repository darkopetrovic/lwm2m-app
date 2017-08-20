import React, {Component} from 'react';
import {Grid} from "semantic-ui-react";
import OwnersList from "../../components/Owners/OwnersList";

class Owners extends Component {

    render() {

        return (
          <div className="animated fadeIn">
              <Grid>
                  <Grid.Row>
                      <Grid.Column width={8}>
                          <OwnersList />
                      </Grid.Column>

                      <Grid.Column width={8}>
                      </Grid.Column>
                  </Grid.Row>
              </Grid>
          </div>
        )
    }
}

export default Owners;
