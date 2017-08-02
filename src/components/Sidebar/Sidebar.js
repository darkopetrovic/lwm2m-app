import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'

class Sidebar extends Component {

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }

  render() {
    return (

      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            <li className="nav-item">
              <NavLink to={'/dashboard'} className="nav-link" activeClassName="active"><i className="icon-speedometer" /> Dashboard <span className="badge badge-info">NEW</span></NavLink>
            </li>

            <li className="nav-title">
              LwM2M Server
            </li>

            <li className="nav-item">
              <NavLink to={'/devices'} className="nav-link" activeClassName="active"><i className="icon-screen-smartphone" /> Devices</NavLink>
            </li>

          </ul>
        </nav>
      </div>
    )
  }
}

export default Sidebar;
