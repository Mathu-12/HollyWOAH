import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, StyleSheet, View, Dimensions, TextInput, Button } from "react-native";
import axios from "axios";
import MovieSection from "../components/MovieSection";
import { ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const TMDB_API_KEY = "d307827794b91eeb1837e75f30b470d2";
const BASE_URL = "https://api.themoviedb.org/3/movie";

const fetchMovies = async (category) => {
  try {
    let allMovies = [];

    for (let page = 1; page <= 6; page++) { // Fetch 3 pages (each page has 20 movies)
      const response = await axios.get(
        `${BASE_URL}/${category}?api_key=${TMDB_API_KEY}&page=${page}`
      );
      allMovies = [...allMovies, ...response.data.results]; // Merge results
    }

    return allMovies; // Return the combined movie list (60 movies)
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
  const [allMovies, setAllMovies] = useState([]); // Store all movies for search
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.replace("Login"); // Redirect to login if token is missing
        return;
      }
    };

    const getMovies = async () => {
      const popular = await fetchMovies("popular");
      const topRated = await fetchMovies("top_rated");
      const upcoming = await fetchMovies("upcoming");
      const nowPlaying = await fetchMovies("now_playing");

      setPopularMovies(popular);
      setTopRatedMovies(topRated);
      setUpcomingMovies(upcoming);
      setNowPlayingMovies(nowPlaying);
      setAllMovies([...popular, ...topRated, ...upcoming, ...nowPlaying]); // Combine all movies
      setLoading(false);
    };

    checkAuth();
    getMovies();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.reset({ index: 0, routes: [{ name: "index" }] });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const filteredMovies = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;

  return (
    <ImageBackground source={require("../assets/images/b1.jpg")} style={styles.background}>
      <View style={styles.overlay}>
        {/* Single Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search movies..."
          placeholderTextColor="#ddd"
          value={searchText}
          onChangeText={setSearchText}
        />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {searchText ? (
            <MovieSection title="🔍 Search Results" movies={filteredMovies} />
          ) : (
            <>
              <MovieSection title="🔥 Popular Movies" movies={popularMovies} />
              <MovieSection title="⭐ Top Rated Movies" movies={topRatedMovies} />
              <MovieSection title="🎬 Upcoming Movies" movies={upcomingMovies} />
              <MovieSection title="🎥 Now Playing" movies={nowPlayingMovies} />
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
    width: "100%",  // Ensure it covers the full screen
    height: "100%", // Ensure full screen height
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay for readability
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  searchBar: {
    width: "100%",
    padding: 10,
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 10,
    marginBottom: 15,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

