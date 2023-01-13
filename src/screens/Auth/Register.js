import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { AxiosContext } from "../../context/AxiosContext";
import { AuthContext } from "../../context/AuthContext";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { publicAxios } = useContext(AxiosContext);
  const authContext = useContext(AuthContext);

  const onRegister = async () => {
    let response;
    try {
      response = await publicAxios.post("/register", {
        email,
        password,
      });

      //ToDo: check response message? to prompt apropriete mesaje to user? or implement data.message response from server.

      console.log("response: " + response.data.token);
      authContext.registerJwt(response.data);

      navigation.navigate("User", {
        user: {
          image:
            "https://p16-va-default.akamaized.net/img/musically-maliva-obj/1606484041765893~c5_720x720.jpeg",
          name: response.data.email,
          following: "50",
          followers: "55",
          likes: "3",
        },
      });
    } catch (error) {
      if (error.response) {
        Alert.alert("Register Failed", error.response.data); // => the response payload
      } else Alert.alert("Register Failed");
      console.log("error: " + error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Cats</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#fefefe"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fefefe"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <Button
        title="Register"
        style={styles.button}
        onPress={() => onRegister()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  logo: {
    fontSize: 60,
    color: "#fff",
    margin: "20%",
  },
  form: {
    width: "80%",
    margin: "10%",
  },
  input: {
    fontSize: 20,
    color: "#fff",
    paddingBottom: 10,
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  button: {},
});

export default Register;
