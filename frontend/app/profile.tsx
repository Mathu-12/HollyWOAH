import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // ✅ Icons

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch User Data from AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      const storedEmail = await AsyncStorage.getItem("userEmail");

      if (storedName && storedEmail) {
        setUser({ name: storedName, email: storedEmail });
      } else {
        router.replace("/login"); // Redirect to login if not found
      }
      setLoading(false);
    };

    getUserData();
  }, []);

  // ✅ Logout Function
  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("userEmail");
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✅ Profile Icon */}
      <Ionicons name="person-circle" size={100} color="white" style={styles.icon} />

      {/* ✅ Display Name & Email */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      {/* ✅ Watchlist Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/watchlater")}>
        <Text style={styles.buttonText}>🎬 View Watchlist</Text>
      </TouchableOpacity>

      {/* ✅ Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  icon: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#bbb",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff4500",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});

