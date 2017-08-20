import React, {Component} from "react";
import {makeDebugger} from '../../utils/debug';
import PropTypes from 'prop-types';
import {Progress} from "semantic-ui-react";
import moment from 'moment';
const debug = makeDebugger('device-infos');

export function computeRemainingLifetime(device){
    const lastseen = moment.utc(device.lastSeen);
    const now = moment();
    const duration = moment.duration(now.diff(lastseen)).asSeconds();
    const elapsed = Math.round(duration);
    return parseInt(device.lifetime)-elapsed;
}

class LifetimeBar extends Component {
    constructor(props){
        super(props);

        this.state = {
            lifetime: props.remaining,
            color: 'green'
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        debug('LifetimeBar - componentWillReceiveProps', nextProps);

        this.setState({
            lifetime: nextProps.remaining
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick() {
        const {total} = this.props;
        let color = 'green';
        const percentage = this.state.lifetime/total *100;

        if(percentage > 50 && percentage < 80){
            color = 'yellow'
        } else if (percentage > 15 && percentage <= 50){
            color = 'orange'
        } else if (percentage > 0 && percentage <= 15){
            color = 'red'
        }

        this.setState({
            lifetime: this.state.lifetime - 1,
            color: color
        });

    }

    render(){
        return (
          <Progress value={this.state.lifetime} total={this.props.total}
                    color={this.state.color} size="small"  progress='ratio'/>
        );
    }
}



LifetimeBar.propTypes = {
    remaining: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
};

export default LifetimeBar;