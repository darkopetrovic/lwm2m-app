import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";


import { Button, Card, Image } from 'semantic-ui-react'

import {Segment, Progress, Item, List, Icon} from 'semantic-ui-react';

import {makeDebugger} from '../../utils/debug';
import Moment from "react-moment";
import LifetimeBar, {computeRemainingLifetime} from "./LifetimeBar";
const debug = makeDebugger('device-devicecard');

class DeviceCard extends Component {
    render() {
        const {device} = this.props;
        debug('render()', device);

        const remainingLifetime = computeRemainingLifetime(device);

        return (
          <Card className="device-card">
              <Card.Content>
                  <Card.Header>
                      {device.name}
                  </Card.Header>
                  <Card.Meta>
                      #{device.id} ({device.type})
                  </Card.Meta>
                  <Card.Description>
                      <List>
                          <List.Item icon='globe' content={device.address} />
                          <List.Item icon='plug' content={device.binding} />
                          <List.Item>
                              <List.Icon name='history'/>
                              <List.Content>
                                <Moment format="DD/MM/YYYY HH:mm:ss">{device.lastSeen}</Moment>
                              </List.Content>
                          </List.Item>
                      </List>
                  </Card.Description>
              </Card.Content>
              <Card.Content extra>
                  <LifetimeBar remaining={parseInt(remainingLifetime)} total={parseInt(device.lifetime)}/>
              </Card.Content>

              <Card.Content extra>
                  <Link to={`/devices/${device.id}`}>
                      <Button floated='right' basic size='mini' content='Settings' icon='settings' labelPosition='left' />
                  </Link>
                      <Button floated='right' basic size='mini' content='Ping' icon='compress' labelPosition='left' />
              </Card.Content>
          </Card>
        );
    }
}

DeviceCard.propTypes = {};
DeviceCard.defaultProps = {};

export default DeviceCard;
