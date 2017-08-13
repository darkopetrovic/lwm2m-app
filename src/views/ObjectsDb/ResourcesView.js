import React, {Component} from 'react';

import {Row, Col} from 'reactstrap';
import ResourcesList from "../../components/ObjectsDb/ResourcesList";

class RersourcesView extends Component {

    render() {

        return (
          <div className="animated fadeIn">
              <Row>
                  <Col className="overflowNone">
                      <ResourcesList per_page="8"/>
                  </Col>
                  <Col>

                  </Col>
              </Row>
          </div>
        )
    }
}

export default RersourcesView;
