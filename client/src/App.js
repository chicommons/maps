import React from "react";
import "./App.css";
import { AuthenticationProvider } from "./context/AuthenticationProvider";
import DirectoryApp from "./components/DirectoryApp";
import { CookiesProvider } from "react-cookie";

function App() {

  return (
    <CookiesProvider>
      <AuthenticationProvider>
        <DirectoryApp />
      </AuthenticationProvider>
    </CookiesProvider>
  );
}

export default App;


