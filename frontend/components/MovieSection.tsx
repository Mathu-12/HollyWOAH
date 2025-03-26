import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const MovieSection = ({ title, movies}) => {
  const [search, setSearch] = useState("");
  const router = useRouter(); // Use expo-router's router for navigation

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search movies..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        horizontal
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/movie/${item.id}`)}
          // Correct dynamic route navigation
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.moviePoster}
            />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red", // Changed from black to red
    textShadowColor: "rgba(255, 0, 0, 0.8)", // Red shadow effect
    textShadowOffset: { width: 2, height: 2 }, // Shadow positioning
    textShadowRadius: 5, 
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default MovieSection;
