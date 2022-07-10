import React from "react";
import "./App.css";
import { AuthenticationProvider } from "./context/AuthenticationProvider";
import DirectoryApp from "./components/DirectoryApp";
import { unregister } from "./interceptors/fetch.js";

function App() {
  return (
    <AuthenticationProvider>
      <DirectoryApp />
    </AuthenticationProvider>
  );
}

export default App;
