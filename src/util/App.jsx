import React from "react";
import { AuthProvider } from "../Contexts/AuthContext";
import Routes from "./Routes";

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
