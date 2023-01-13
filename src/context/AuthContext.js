import React, { createContext, useState } from "react";
import * as Keychain from "react-native-keychain";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext(null);
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    refreshToken: null,
    authenticated: null,
  });

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setAuthState({
      accessToken: null,
      refreshToken: null,
      authenticated: false,
    });
  };

  const getAccessToken = () => {
    return authState.accessToken;
  };

  const registerJwt = async (responseToken) => {
    //const { accessToken, refreshToken } = response.data;
    //ToDo: refresh token to be implemented
    //ToDo: check for a valid token?
    const accessToken = responseToken.token;
    const refreshToken = "ToBe implemented";
    setAuthState({
      accessToken,
      refreshToken,
      authenticated: true,
    });

    try {
      await SecureStore.setItemAsync(
        "token",
        JSON.stringify({
          accessToken,
          refreshToken,
        })
      );

      console.log("SecureStore jwt for future auth: " + responseToken.token);
    } catch (error) {
      console.log("error storing token: " + error);
    }
  };

  return (
    <Provider
      value={{
        authState,
        getAccessToken,
        setAuthState,
        logout,
        registerJwt,
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
