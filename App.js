import React from "react";

import Routes from "./src/routes";
import { AuthProvider } from "./src/context/AuthContext";
import { AxiosProvider } from "./src/context/AxiosContext";
import { RootSiblingParent } from "react-native-root-siblings";

function App() {
  return (
    <RootSiblingParent>
      <AuthProvider>
        <AxiosProvider>
          <Routes />
        </AxiosProvider>
      </AuthProvider>
    </RootSiblingParent>
  );
}

export default App;
