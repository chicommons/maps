import React from 'react';
import { useAuthentication } from '../hooks';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Map from "./Map";
import NavBar from "./NavBar";
import Add from "./Add";
import Edit from "./Edit";
import Search from "./Search";
import Login from "./Login";
import NewUser from "./NewUser";
import NoCoordsSearch from "./NoCoordsSearch";
import DirectoryAddUpdate from "./DirectoryAddUpdate";
import AddPerson from "./people/AddPerson";
import EditPerson from "./people/EditPerson";
import ListPeople from "./people/ListPeople";
import Footer from "./Footer";
import { AlertProvider } from "./AlertProvider";
import Logo from "../logo.png";
import UnapprovedList from "./UnapprovedList";
import PrivateRoute from "./PrivateRoute";
import Spreadsheet from './Spreadsheet'

const DirectoryApp = () => {
  console.log("starting get hook value ...");
  const { isAuthenticated } = useAuthentication();
  console.log("is auth:" + isAuthenticated);

  return (
      <Router>
        <div className="App">
          <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container">
              <Link className="navbar-brand" to={"/add"}>
                <img src={Logo} alt="Chicommons" />
              </Link>
              <NavBar authed={isAuthenticated}/>
            </div>
          </nav>

          <AlertProvider>
            <div className="auth-wrapper">
              <div className="auth-inner">
                <Switch>
                  <Route exact path="/" component={Map} />
                  <Route path="/login" component={Login} />
                  <PrivateRoute authed={isAuthenticated} path="/signup" component={NewUser} />
                  <Route path="/add" component={Add} />
                  <Route path="/edit/:id" component={Edit} />
                  <Route path="/search" component={Search} />
                  <Route path="/nocoords" component={NoCoordsSearch} />
                  <Route
                    path="/directory-additions-updates/:id"
                    component={DirectoryAddUpdate}
                  />
                  {/* New path for approval page. Will :id work? Doing 827 to test */}
                  <Route
                    path="/approve-coop/:id"
                    component={DirectoryAddUpdate}
                  />
                  <Route
                    path="/directory-additions-updates/"
                    component={DirectoryAddUpdate}
                  />
                  <PrivateRoute
                  authed={isAuthenticated} path="/unapproved-list/"
                  component={UnapprovedList}
                  />
                  <PrivateRoute authed={isAuthenticated} path="/:coop_id/people" component={AddPerson} />
                  <Route path="/person/:id/edit" component={EditPerson} />
                  <Route path="/:coop_id/listpeople" component={ListPeople} />
                  <PrivateRoute authed={isAuthenticated} path="/spreadsheet" component={Spreadsheet} />
                </Switch>
              </div>
            </div>
          </AlertProvider>
          <Footer />
        </div>
      </Router>
  );
};

export default DirectoryApp;
