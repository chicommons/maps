import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import HamburgerMenu from 'react-hamburger-menu';
import { isMobile } from 'react-device-detect';
import { useAuthentication } from '../hooks';
import './NavBar.css';

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      hideOrShowHambugerDropDown: 'nav'
    };
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleSelect = () => {
    this.setState({ open: false });
  };

  displayHamburgerMenu = () => {
    return (
      <HamburgerMenu
        isOpen={this.state.open}
        menuClicked={this.handleClick.bind(this)}
        width={18}
        height={15}
        strokeWidth={1}
        rotate={0}
        color="black"
        borderRadius={0}
        animationDuration={0.5}
      />
    );
  };

  displayNavBar = () => {
    return (
      <ul className="nav">
        <li className="nav-link">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>
        </li>
        <li className="nav-link">
          <NavLink className="nav-link" to="/directory-additions-updates">
            Add
          </NavLink>
        </li>
        <li className="nav-link">
          <NavLink to="/search" className="nav-link">
            Search
          </NavLink>
        </li>
        <li className="nav-link">
          <a
            href="https://www.chicommons.coop/cooperative-map/"
            className="nav-link"
          >
            Return
          </a>
        </li>
        {this.props.authed && (
          <li className="nav-link">
            <NavLink to="/spreadsheet" className="nav-link">
              Update Coops
            </NavLink>
          </li>
        )}
        {!this.props.authed ? (
          <li className="nav-link">
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
          </li>
        ) : (
          <li className="nav-link">
            <NavLink to="/signup" className="nav-link">
              New User
            </NavLink>
          </li>
        )}
      </ul>
    );
  };

  displayMobileMenu = () => {
    return (
      <ul className="hamburgerDropDown" onClick={this.handleSelect}>
        <li className="nav-link">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>
        </li>
        <li className="nav-link">
          <NavLink to="/directory-additions-updates">Add</NavLink>
        </li>
        <li className="nav-link">
          <NavLink to="/search" className="nav-link">
            Search
          </NavLink>
        </li>
        <li className="nav-link">
          <NavLink to="/nocoords" className="nav-link">
            No Coords Search
          </NavLink>
        </li>
        <li className="nav-link">
          <a
            href="https://www.chicommons.coop/cooperative-map/"
            className="nav-link"
          >
            Return
          </a>
        </li>
      </ul>
    );
  };

  render() {
    return (
      <div className="navbar">
        {isMobile ? this.displayHamburgerMenu() : this.displayNavBar()}
        {this.state.open ? this.displayMobileMenu() : null}
      </div>
    );
  }
}

const navLinkStyle = {
  backgroundColor: '#2295a2'
};

export default NavBar;
