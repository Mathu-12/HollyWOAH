import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Text } from "react-native";
import { useRouter } from "expo-router"; 

export default function SettingsPage() {
  const router = useRouter();
  const [profileText, setProfileText] = useState("Profile");
  const [logoutText, setLogoutText] = useState("Logout");

  return (
    <ImageBackground 
      source={require("../assets/images/b2.jpg")} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/profile")}>
          <TextInput 
            style={styles.input} 
            value={profileText} 
            onChangeText={setProfileText}
            placeholder="Type Profile Text"
            placeholderTextColor="white"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => router.replace("/login")}>
          <TextInput 
            style={styles.input} 
            value={logoutText} 
            onChangeText={setLogoutText}
            placeholder="Type Logout Text"
            placeholderTextColor="white"
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // ✅ Transparent background
  },
  option: {
    width: "50%",
    padding: 15,
    backgroundColor: "transparent", // ✅ Fully transparent button
    marginVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 4, // ✅ White border
    borderColor: "white",
    shadowColor: "white", // ✅ White shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  input: {
    color: "white", // ✅ White text
    fontSize: 18,
    textAlign: "center",
    width: "100%",
  },
});


