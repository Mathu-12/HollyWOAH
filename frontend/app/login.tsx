import React, { useState } from "react";
import { 
  View, TextInput, Text, Modal, 
  ImageBackground, StyleSheet, ActivityIndicator, TouchableOpacity 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../utils/api";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email address.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await loginUser(email, password);
      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        setSuccessModal(true);
        setTimeout(() => {
          setSuccessModal(false);
          router.push("../homepage");
        }, 2000);
      } else {
        setEmailError("Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setEmailError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require("../assets/images/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor="#BBBBBB"
          style={styles.input}
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#BBBBBB"
          style={styles.input}
        />
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={successModal} transparent>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Logged in successfully!</Text>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "90%",
    height: 50,
    borderWidth: 2,
    borderColor: "#FFFFFF", // Keep the white border
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    textAlign: "center",
    // Remove any shadow effect
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    elevation: 0, // Ensures no shadow on Android
  },
  error: {
    color: "#FF4C4C",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    width: "90%",
  },
  button: {
    width: "40%",
    height: 40,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // Remove any shadow effect
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
  },
});

