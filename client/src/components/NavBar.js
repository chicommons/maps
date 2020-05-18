import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import HamburgerMenu from 'react-hamburger-menu';
import {isMobile} from 'react-device-detect';
import './NavBar.css';

class NavBar extends Component {
    constructor(){
        super()
        this.state = {
            open: false,
            hideOrShowHambugerDropDown: 'nav'
        }
    }

    handleClick = () => {
        this.setState({open: !this.state.open});
    }

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
                    color='black'
                    borderRadius={0}
                    animationDuration={0.5}
                />
        )
    }

    displayNavBar = () => {
        return (
            <ul className='nav'>
                    <li className='nav-link'><NavLink to='/add'>Add</NavLink></li>
                    <li className='nav-link'><NavLink to='/search'>Search</NavLink></li>
                </ul>
        )
    }

    displayMobileMenu = () => {
        return (
            <ul className='hamburgerDropDown' onClick={this.handleSelect}>
                    <li className='nav-link'><NavLink to='/add'>Add</NavLink></li>
                    <li className='nav-link'><NavLink to='/search'>Search</NavLink></li>
                </ul>
        )
    }

    render() {
        return (
          <div className="navbar">
            {isMobile ? this.displayHamburgerMenu() : this.displayNavBar()}
            {this.state.open ? this.displayMobileMenu() : null}
          </div>
        );
    }
}

export default NavBar;
