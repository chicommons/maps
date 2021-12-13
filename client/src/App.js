import React from "react";
import "./App.css";
import { AuthenticationProvider } from "./context/AuthenticationProvider";
import DirectoryApp from "./components/DirectoryApp";

function App() {
  return (
    <AuthenticationProvider>
      <DirectoryApp />
    </AuthenticationProvider>
  );
}

export default App;
