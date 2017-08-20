import React, { Component } from 'react'
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'

class SidebarBottomOverlay extends Component {
    state = { visible: false }

    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    render() {
        const { visible } = this.state
        return (
          <div>
              <Button onClick={this.toggleVisibility}>Toggle Visibility</Button>
              <Sidebar.Pushable width='wide'>
                  <Sidebar animation='overlay' width='wide' direction='bottom' visible={visible} inverted>
                      sfklsdjf
                  </Sidebar>
                  <Sidebar.Pusher width='wide'>
                      {/*<Segment basic>*/}
                      {this.props.children}

                      {/*</Segment>*/}
                  </Sidebar.Pusher>
              </Sidebar.Pushable>
          </div>
        )
    }
}

export default SidebarBottomOverlay