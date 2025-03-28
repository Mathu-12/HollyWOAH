import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
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
    backgroundColor: "#ff4500",
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
