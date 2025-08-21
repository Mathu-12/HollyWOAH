import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground, Image 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "", profileImage: null });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch User Data when page is focused
  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        setLoading(true);
        const storedName = await AsyncStorage.getItem("userName");
        const storedEmail = await AsyncStorage.getItem("userEmail");
        const storedImage = await AsyncStorage.getItem("profileImage");

        if (storedName && storedEmail) {
          setUser({ name: storedName, email: storedEmail, profileImage: storedImage });
        } else {
          router.replace("/login"); // Redirect to login if not found
        }
        setLoading(false);
      };

      getUserData();
    }, [])
  );

  // ✅ Logout Function
  const handleLogout = async () => {
    await AsyncStorage.clear(); // Clears all stored data
    router.replace("/login");
  };

  // ✅ Profile Image Picker
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUser((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
      await AsyncStorage.setItem("profileImage", result.assets[0].uri);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <ImageBackground 
      source={require("../assets/images/m.jpg")} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle" size={100} color="white" style={styles.icon} />
          )}
        </TouchableOpacity>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/watchlater")}>
          <Text style={styles.buttonText}>🎬 View Watchlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// ✅ Styles
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  icon: {
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
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
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: "white",
    shadowColor: "white",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    marginBottom: 10,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: "white",
    shadowColor: "white",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    width: "50%",
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});

