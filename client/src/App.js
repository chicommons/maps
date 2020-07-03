import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import NavBar from "./components/NavBar";
import Add from "./components/Add";
import Search from "./components/Search";
import { Flash } from "./components/Flash";
import Bus from "./components/Utils/Bus";

function App() {
  return (
    <Router>
      <div className="App">
        <Flash />
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={"/add"}>
              Chicommons
            </Link>
            <NavBar />
          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path="/" component={Add} />
              <Route path="/add" component={Add} />
              <Route path="/search" component={Search} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

window.flash = (message, type = "success") =>
  Bus.emit("flash", { message, type });

export default App;
