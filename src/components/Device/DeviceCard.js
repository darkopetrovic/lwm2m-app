import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";


import { Button, Card, Image } from 'semantic-ui-react'

import {Segment, Progress, Item, List, Icon} from 'semantic-ui-react';

import {makeDebugger} from '../../utils/debug';
const debug = makeDebugger('device-devicecard');

class DeviceCard extends Component {
    render() {
        debug('render()');
        const {device} = this.props;

        return (
          <Card className="device-card">
              <Card.Content>
                  <Card.Header>
                      {device.name}
                  </Card.Header>
                  <Card.Meta>
                      {/*{device.address}*/}
                      Smart Device
                  </Card.Meta>
                  <Card.Description>
                      <List>
                          <List.Item icon='globe' content='2001:db8:85a3:8d3:1319:8a2e:370:7348' />
                          <List.Item icon='marker' content='New York, NY' />

                          <List.Item icon='mail' content={<a href='mailto:jack@semantic-ui.com'>jack@semantic-ui.com</a>} />
                      </List>
                  </Card.Description>
              </Card.Content>
              <Card.Content extra>
                  <Progress value='4' total='5' color='green' size="small" />
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
