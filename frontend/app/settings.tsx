import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter for navigation

export default function SettingsPage() {
  const router = useRouter(); // Correct navigation method

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={() => router.push("/profile")}>
        <Text style={styles.optionText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => router.replace("/login")}>
        <Text style={styles.optionText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  option: {
    width: "80%",
    padding: 15,
    backgroundColor: "#444",
    marginVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
  },
});
