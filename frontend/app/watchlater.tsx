import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function WatchLater() {
  const [movies, setMovies] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchWatchLaterMovies = async () => {
      const storedMovies = await AsyncStorage.getItem("watchLater");
      if (storedMovies) {
        setMovies(JSON.parse(storedMovies));
      }
    };

    fetchWatchLaterMovies();
  }, []);

  const removeMovie = async (movieTitle: string) => {
    const updatedMovies = movies.filter((movie) => movie !== movieTitle);
    setMovies(updatedMovies);
    await AsyncStorage.setItem("watchLater", JSON.stringify(updatedMovies));
  };

  return (
    <ImageBackground 
      source={require("../assets/images/b1.jpg")} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Watch Later Movies</Text>
        {movies.length === 0 ? (
          <Text style={styles.emptyMessage}>No movies added yet.</Text>
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.movieItem}>
                <Text style={styles.movieText}>{item}</Text>
                <TouchableOpacity onPress={() => removeMovie(item)} style={styles.deleteButton}>
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>⬅ Back</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay for better contrast
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
  },
  movieItem: {
    padding: 15,
    backgroundColor: "#222",
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  movieText: {
    fontSize: 18,
    color: "white",
  },
  deleteButton: {
    padding: 10,
  },
  deleteIcon: {
    fontSize: 22,
    color: "#ff4500",
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "transparent", // Transparent background
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",  // ✅ This will center the button horizontally
    borderWidth: 4, // White border
    borderColor: "white",
    shadowColor: "white", // White shadow effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
    width: 150, // Button width reduced
  }
  ,
  backButtonText: {
    color: "white", // White text
    fontSize: 18,
    fontWeight: "bold",
  },
})

