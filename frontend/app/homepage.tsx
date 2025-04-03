import React, { useEffect, useState } from "react";
import { 
  ScrollView, ActivityIndicator, StyleSheet, View, Dimensions, TextInput, Button, TouchableOpacity 
} from "react-native";
import axios from "axios";
import MovieSection from "../components/MovieSection";
import { ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Correct Router
import { Ionicons } from "@expo/vector-icons"; // Settings Icon
import { StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");

const TMDB_API_KEY = "your api key";
const BASE_URL = "your base url";

const fetchMovies = async (category) => {
  try {
    let allMovies = [];
    for (let page = 1; page <= 5; page++) {
      const response = await axios.get(`${BASE_URL}/${category}?api_key=${TMDB_API_KEY}&page=${page}`);
      allMovies = [...allMovies, ...response.data.results];
    }
    return allMovies;
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error);
    return [];
  }
};

export default function HomePage() {
  const [movies, setMovies] = useState({
    popular: [],
    topRated: [],
    upcoming: [],
    nowPlaying: [],
    all: [],
  });
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Correct Expo Router

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/login"); 
        return;
      }
    };

    const getMovies = async () => {
      const [popular, topRated, upcoming, nowPlaying] = await Promise.all([
        fetchMovies("popular"),
        fetchMovies("top_rated"),
        fetchMovies("upcoming"),
        fetchMovies("now_playing"),
      ]);

      setMovies({
        popular,
        topRated,
        upcoming,
        nowPlaying,
        all: [...popular, ...topRated, ...upcoming, ...nowPlaying],
      });

      setLoading(false);
    };

    checkAuth();
    getMovies();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      router.replace("../index"); // Correct navigation after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const filteredMovies = movies.all.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <ActivityIndicator size="large" color="#fff" style={styles.loader} />;

  return (
    <ImageBackground source={require("../assets/images/b1.jpg")} style={styles.background}>
      <View style={styles.overlay}>
        {/* Search Bar with Settings Icon */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search movies..."
            placeholderTextColor="#ddd"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Ionicons name="settings-outline" size={24} color="#fff" style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {searchText ? (
            <MovieSection title="🔍 Search Results" movies={filteredMovies} />
          ) : (
            <>
              <MovieSection title="🔥 Popular Movies" movies={movies.popular} />
              <MovieSection title="⭐ Top Rated Movies" movies={movies.topRated} />
              <MovieSection title="🎬 Upcoming Movies" movies={movies.upcoming} />
              <MovieSection title="🎥 Now Playing" movies={movies.nowPlaying} />
            </>
          )}
          <Button title="Logout" onPress={handleLogout} color="red" />
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingTop: StatusBar.currentHeight || 10, // Adjust for mobile status bar
    height: 50, // Ensure proper height
  },
  searchBar: {
    flex: 1,
    padding: 10,
    color: "#fff",
  },
  settingsIcon: {
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});
