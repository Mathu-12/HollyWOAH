import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const MovieSection = ({ title, movies }) => {
  const router = useRouter(); // Use expo-router's router for navigation

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/movie/${item.id}`)}>
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
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default MovieSection;
