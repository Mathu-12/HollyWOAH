import { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Modal, 
  ImageBackground, StyleSheet, ActivityIndicator, Animated 
} from "react-native";
import { registerUser } from "../utils/api";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const router = useRouter();

  const validateForm = () => {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");

    if (!name) {
      setNameError("Name is required.");
      valid = false;
    }

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

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await registerUser(name, email, password);
      setSuccessModal(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        setSuccessModal(false);
        router.push("/homepage");
      }, 2000);
    } catch (error) {
      console.error("Signup Error:", error);
      setEmailError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require("../assets/images/O.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Create an Account</Text>

        <View style={styles.inputContainer}>
          <TextInput
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Success Modal */}
      <Modal visible={successModal} transparent>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <Text style={styles.modalText}>Account created successfully! 🎉</Text>
          </Animated.View>
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#DDDDDD", // Changed from gold to soft gray for a cleaner look
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)", 
    borderColor: "#BBBBBB", // Softer gray for modern look
    color: "#FFFFFF", 
    padding: 12,
    width: "85%",
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    color: "#FF4C4C",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "left",
    width: "85%",
  },
  button: {
    backgroundColor: "linear-gradient(90deg, #D32F2F, #1976D2)", // Red to Blue (Cap's Shield Theme)
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF", // White border for contrast
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    alignSelf: "center",  // Centering the button
  },
  
  buttonText: {
    color: "#FFFFFF", // White text for contrast
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  

  /** MODAL STYLES **/
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#333333", // Darker modal box for better contrast
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#D4AF37", // Softer metallic gold instead of bright gold
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});


