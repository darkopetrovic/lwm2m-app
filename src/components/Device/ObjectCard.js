import _ from "lodash";
import React, {Component} from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getResourceValue } from "../../actions/index";

import {
    Card, CardHeader, CardBlock, Row, Col
} from 'reactstrap';



class ObjectCard extends Component {
    constructor(props) {
        super(props);

    }

    renderResources(resources) {
        const did = this.props.device.id;
        const oid = this.props.object.id;
        const iid = this.props.object.instanceId;

        return _.map(resources, resource  => {
            return (
              <Row key={resource.id}>
                  <Col xs="5" className="resource-row-name">{resource.shortname}</Col>
                  <Col xs="4">
                      {resource.access.indexOf('R')>=0  && (
                        <span>
                    <button type="button"
                            className="btn btn-secondary btn-sm lwm2m-btn"
                            title="Read"
                            onClick={() => this.props.getResourceValue(did, oid, iid, resource.id)}
                            >
                        <i className="icon-refresh" />
                    </button>
                    <button type="button" className="btn btn-secondary btn-sm lwm2m-btn">
                      <i className="icon-eye"/>
                    </button></span>
                      )}

                      {resource.access.indexOf('W')>=0 &&
                      <button type="button" className="btn btn-secondary btn-sm lwm2m-btn">
                          <i className="icon-pencil" />
                      </button>
                      }

                      {resource.access.indexOf('E')>=0  &&
                      <button type="button" className="btn btn-secondary btn-sm lwm2m-btn">
                          <i className="icon-control-play" />
                      </button>
                      }

                  </Col>
                  <Col xs="3" className="resource-row-value">{resource.value}</Col>
              </Row>
            );
        });


    }

    render () {
        return (
          <Card className="object-card">
              <CardHeader>
                  {this.props.object.shortname}
                  <div className="float-right mb-0">
                      <button type="button" className="btn btn-secondary btn-sm lwm2m-btn">
                          <i className="icon-refresh" />
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm lwm2m-btn">
                          <i className="icon-magnifier" />
                      </button>

                  </div>
              </CardHeader>
              <CardBlock>
                  {this.renderResources(this.props.object.resources)}
              </CardBlock>

          </Card>


        );
    }

}

function mapStateToProps({devices}) {
    return { device: devices.active };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getResourceValue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectCard);
