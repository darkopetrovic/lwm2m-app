import React, { Component } from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

class Header extends Component {

    constructor(props){
        super(props)

        this.sidebarToggle = this.sidebarToggle.bind(this);
        this.asideToggle = this.asideToggle.bind(this);
    }

    sidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-hidden');

        this.props.dispatch({
            type: 'TOGGLE_LEFT_SIDEBAR'
        })

    }

    sidebarMinimize(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-minimized');
    }

    mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show');
    }

    asideToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('aside-menu-hidden');

        this.props.dispatch({
            type: 'TOGGLE_RIGHT_SIDEBAR'
        })

    }

    render() {
        return (
          <header className="app-header navbar">
              <button className="navbar-toggler mobile-sidebar-toggler d-lg-none" onClick={this.mobileSidebarToggle} type="button">&#9776;</button>
              <a className="navbar-brand" href="#" />
              <ul className="nav navbar-nav d-md-down-none mr-auto">
                  <li className="nav-item">
                      <button className="nav-link navbar-toggler sidebar-toggler" type="button" onClick={this.sidebarToggle}>&#9776;</button>
                  </li>
              </ul>
              <ul className="nav navbar-nav ml-auto">
                  <li className="nav-item d-md-down-none">
                      <button className="nav-link navbar-toggler aside-menu-toggler" type="button" onClick={this.asideToggle}>&#9776;</button>
                  </li>
              </ul>
          </header>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
};

function mapDispatchToProps(dispatch) {
    return {dispatch};
}

export default connect(null, mapDispatchToProps)(Header);

