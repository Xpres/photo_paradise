import React from "react";

import Routes from "./src/routes";
import { AuthProvider } from "./src/context/AuthContext";
import { AxiosProvider } from "./src/context/AxiosContext";

function App() {
  return (
    <AuthProvider>
      <AxiosProvider>
        <Routes />
      </AxiosProvider>
    </AuthProvider>
  );
}

export default App;
