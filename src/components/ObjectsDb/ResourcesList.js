import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Button, Grid, Input, Segment} from "semantic-ui-react";

class ResourcesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputSearchValue: ""
        };

        this.onSearchInput = this.onSearchInput.bind(this);
    }

    onSearchInput(e, data)
    {
        const searchTerm = data.value;
        this.setState({
            inputSearchValue: searchTerm,
        });
    }


    render() {

        let {inputSearchValue} = this.state;

        return (
          <div>
              <Segment >
              <Grid>

                  <Grid.Column width={4}>
                      <Button fluid>Clear</Button>
                  </Grid.Column>

                  <Grid.Column width={4}>
                      <Button fluid>Clear</Button>
                  </Grid.Column>

                  <Grid.Column width={4}>
                      <Button fluid>Clear</Button>
                  </Grid.Column>

                  <Grid.Column width={4}>
                      <Button fluid>Clear</Button>
                  </Grid.Column>

              </Grid>
              </Segment>
          </div>
        );
    }
}

ResourcesList.propTypes = {};
ResourcesList.defaultProps = {};

function mapStateToProps(state) {
    return {
        state: state
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(null, dispatch);
}

export default connect(mapStateToProps)(ResourcesList);