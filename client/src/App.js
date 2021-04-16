import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Alert } from "reactstrap";

import NavBar from "./components/NavBar";
import Add from "./components/Add";
import Edit from "./components/Edit";
import Search from "./components/Search";
import NoCoordsSearch from "./components/NoCoordsSearch";
import DirectoryAddUpdate from "./components/DirectoryAddUpdate";
import AddPerson from "./components/people/AddPerson";
import EditPerson from "./components/people/EditPerson";
import ListPeople from "./components/people/ListPeople";
import { AlertProvider } from "./components/AlertProvider";
import Logo from "./logo.png";

function App() {
  return (
    <Router>
      <div className="App">
        <nav
          className="navbar navbar-expand-lg navbar-light fixed-top"
          style={{ backgroundColor: "#fffcf5" }}
        >
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
                <Route exact path="/" component={Add} />
                <Route path="/add" component={Add} />
                <Route path="/edit/:id" component={Edit} />
                <Route path="/search" component={Search} />
                <Route path="/nocoords" component={NoCoordsSearch} />
                <Route
                  path="/directory-additions-updates"
                  component={DirectoryAddUpdate}
                />
                <Route path="/:coop_id/people" component={AddPerson} />
                <Route path="/person/:id/edit" component={EditPerson} />
                <Route path="/:coop_id/listpeople" component={ListPeople} />
              </Switch>
            </div>
          </div>
        </AlertProvider>
      </div>
    </Router>
  );
}

export default App;
