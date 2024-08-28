import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import HamburgerMenu from 'react-hamburger-menu';
import { isMobile } from 'react-device-detect';
import useAuthentication from '../hooks/useAuthentication';
import './NavBar.css';



const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [hideOrShowHamburgerDropDown, setHideOrShowHamburgerDropDown] = useState('nav');
  const { isAuthenticated } = useAuthentication();

  useEffect(() => {
    console.log("NavBar re-rendered, isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  const handleClick = () => {
    setOpen(!open);
    setHideOrShowHamburgerDropDown(open ? 'hamburgerDropDown' : 'nav');
  };

  const handleSelect = () => {
    setOpen(false);
    setHideOrShowHamburgerDropDown('nav');
  };

  const displayHamburgerMenu = () => {
    return (
      <HamburgerMenu
        isOpen={open}
        menuClicked={handleClick}
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


  const displayNavBar = () => {
    return (
      <ul className="nav">
        <li className="nav-link"><NavLink className="nav-link" to="/">Home</NavLink></li>
        <li className="nav-link"><NavLink className="nav-link" to="/directory-additions-updates">Add</NavLink></li>
        <li className="nav-link"><NavLink to="/search" className="nav-link">Search</NavLink></li>
        <li className="nav-link"><a href="https://www.chicommons.coop/cooperative-map/" className="nav-link">Return</a></li>
        {isAuthenticated ? (                                                                                                            //rerender navbar based on  authentication state
          <>
            <li className="nav-link"><NavLink to="/spreadsheet" className="nav-link">Update Coops</NavLink></li>
            <li className="nav-link"><NavLink to="/signup" className="nav-link">New User</NavLink></li>
          </>
        ) : (
          <li className="nav-link"><NavLink to="/login" className="nav-link">Login</NavLink></li>                                 // if unauthetnicated display login link 
        )}
      </ul>
    );
  };

  const displayMobileMenu = () => {
    return (
      <ul className={hideOrShowHamburgerDropDown} onClick={handleSelect}>
        <li className="nav-link"><NavLink className="nav-link" to="/">Home</NavLink></li>
        <li className="nav-link"><NavLink to="/directory-additions-updates">Add</NavLink></li>
        <li className="nav-link"><NavLink to="/search" className="nav-link">Search</NavLink></li>
        <li className="nav-link"><NavLink to="/nocoords" className="nav-link">No Coords Search</NavLink></li>
        <li className="nav-link"><a href="https://www.chicommons.coop/cooperative-map/" className="nav-link">Return</a></li>
      </ul>
    );
  };

  return (
    <div className="navbar">
      {isMobile ? displayHamburgerMenu() : displayNavBar()}
      {open ? displayMobileMenu() : null}
    </div>
  );
};

export default NavBar;
