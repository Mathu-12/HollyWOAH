import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, StyleSheet, View, Dimensions, Button } from "react-native";
import axios from "axios";
import MovieSection from "../components/MovieSection";
import { ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window"); // Get full screen dimensions

const TMDB_API_KEY = "d307827794b91eeb1837e75f30b470d2";
const BASE_URL = "https://api.themoviedb.org/3/movie";

const fetchMovies = async (category: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${category}?api_key=${TMDB_API_KEY}`);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error);
    return [];
  }
};

export default function HomePage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // For navigating

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.replace("Login"); // Redirect to login if token is missing
        return;
      }
    };

    const getMovies = async () => {
      setPopularMovies(await fetchMovies("popular"));
      setTopRatedMovies(await fetchMovies("top_rated"));
      setUpcomingMovies(await fetchMovies("upcoming"));
      setNowPlayingMovies(await fetchMovies("now_playing"));
      setLoading(false);
    };

    checkAuth();
    getMovies();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken"); // Remove stored authentication token
      navigation.replace("Login"); // Redirect to login screen
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;

  return (
    <ImageBackground source={require("../assets/images/b1.jpg")} style={styles.background}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <MovieSection title="🔥 Popular Movies" movies={popularMovies} />
          <MovieSection title="⭐ Top Rated Movies" movies={topRatedMovies} />
          <MovieSection title="🎬 Upcoming Movies" movies={upcomingMovies} />
          <MovieSection title="🎥 Now Playing" movies={nowPlayingMovies} />
          <Button title="Logout" onPress={handleLogout} color="red" />
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: width,  // Ensure full screen width
    height: height, // Ensure full screen height
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for readability
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1, // Ensure the ScrollView takes full space
    paddingBottom: 20, // Prevent content from cutting off
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});
