import React from "react";
import "./App.css";
<<<<<<< HEAD
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Alert } from "reactstrap";

import Map from "./components/Map";
import NavBar from "./components/NavBar";
import Add from "./components/Add";
import Edit from "./components/Edit";
import Search from "./components/Search";
import NoCoordsSearch from "./components/NoCoordsSearch";
import DirectoryAddUpdate from "./components/DirectoryAddUpdate";
import AddPerson from "./components/people/AddPerson";
import EditPerson from "./components/people/EditPerson";
import ListPeople from "./components/people/ListPeople";
import Footer from "./components/Footer";
import { AlertProvider } from "./components/AlertProvider";
import Logo from "./logo.png";
import UnapprovedList from "./components/UnapprovedList";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={"/add"}>
              <img src={Logo} alt="Chicommons" />
            </Link>
            <NavBar />
          </div>
        </nav>

        <AlertProvider>
          <div className="auth-wrapper">
            <div className="auth-inner">
              <Switch>
                <Route exact path="/" component={Map} />
                <Route path="/add" component={Add} />
                <Route path="/edit/:id" component={Edit} />
                <Route path="/search" component={Search} />
                <Route path="/nocoords" component={NoCoordsSearch} />
                <Route
                  path="/directory-additions-updates/:id"
                  component={DirectoryAddUpdate}
                />
                <Route
                  path="/directory-additions-updates/"
                  component={DirectoryAddUpdate}
                />
                {/* New path for approval page. Will :id work? Doing 827 to test */}
                <Route 
                  path="/approve-coop/:id"
                  component={DirectoryAddUpdate}
                />

                <Route 
                  path="/unapproved-list/"
                  component={UnapprovedList}
                />

                <Route path="/:coop_id/people" component={AddPerson} />
                <Route path="/person/:id/edit" component={EditPerson} />
                <Route path="/:coop_id/listpeople" component={ListPeople} />
              </Switch>
            </div>
          </div>
        </AlertProvider>
        <Footer />
      </div>
    </Router>
=======
import { AuthenticationProvider } from "./context/AuthenticationProvider";
import DirectoryApp from "./components/DirectoryApp";

function App() {
  return (
    <AuthenticationProvider>
      <DirectoryApp />
    </AuthenticationProvider>
>>>>>>> authentication
  );
}

export default App;
