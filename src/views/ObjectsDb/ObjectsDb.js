import React, {Component} from 'react';

import {Container, Row, Col} from 'reactstrap';
import ObjectsList from "../../components/ObjectsDb/ObjectsList";
import ResourcesList from "../../components/ObjectsDb/ObjectResourcesList";
import {Grid} from "semantic-ui-react";

class ObjectsDb extends Component {

    render() {

        return (
          <div className="animated fadeIn">
              {/*<Row>*/}
                  {/*<Col className="overflowNone">*/}
                      {/*<ObjectsList />*/}
                  {/*</Col>*/}
                  {/*<Col>*/}

                  {/*</Col>*/}
              {/*</Row>*/}

              <Grid>
                  <Grid.Row>
                      <Grid.Column className="overflowNone" width={8}>
                          <ObjectsList />
                      </Grid.Column>

                      <Grid.Column width={8}>

                      </Grid.Column>
                  </Grid.Row>
              </Grid>


          </div>
        )
    }
}

export default ObjectsDb;
