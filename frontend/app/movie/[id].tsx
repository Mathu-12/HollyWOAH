import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Linking, ImageBackground, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TMDB_API_KEY = "d307827794b91eeb1837e75f30b470d2";
const YOUTUBE_API_KEY = "AIzaSyBN_dP5E-e0pN6JQKGLxUGT-M-ChxfFKmA";

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`);
        setMovie(movieRes.data);
        fetchTrailer(movieRes.data.title);

        const storedMovies = await AsyncStorage.getItem("watchLater");
        const movieList = storedMovies ? JSON.parse(storedMovies) : [];
        setIsFavorite(movieList.includes(movieRes.data.title));
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTrailer = async (movieTitle) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieTitle} official trailer&key=${YOUTUBE_API_KEY}`
        );
        const trailerId = res.data.items[0]?.id?.videoId;
        if (trailerId) setTrailerUrl(`https://www.youtube.com/watch?v=${trailerId}`);
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      const storedMovies = await AsyncStorage.getItem("watchLater");
      let movieList = storedMovies ? JSON.parse(storedMovies) : [];

      if (isFavorite) {
        movieList = movieList.filter((title) => title !== movie.title);
      } else {
        movieList.push(movie.title);
      }

      await AsyncStorage.setItem("watchLater", JSON.stringify(movieList));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating watch later list:", error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="blue" style={styles.loader} />;
  if (!movie) return <Text>Error loading movie details</Text>;

  return (
    <ImageBackground source={require("../../assets/images/b2.jpg")} style={{ flex: 1, width: '100%', height: '100%' }} resizeMode="cover">
      <ScrollView style={styles.container}>
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={{ width: width * 0.6, height: height * 0.4, resizeMode: "contain", alignSelf: "center" }} />
        <Text style={[styles.title, { fontSize: width > 500 ? 24 : 18 }]}>{movie.title}</Text>
        <Text style={[styles.rating, { fontSize: width > 500 ? 20 : 14 }]}>⭐ {movie.vote_average} / 10</Text>
        <Text style={[styles.overview, { fontSize: width > 500 ? 16 : 12 }]}>{movie.overview}</Text>

        <View style={styles.buttonContainer}>
          {trailerUrl && (
            <TouchableOpacity onPress={() => trailerUrl && Linking.openURL(trailerUrl)} style={styles.trailerButton}>
              <Text style={styles.trailerText}>Watch Trailer</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
            <Text style={{ fontSize: 24 }}>{isFavorite ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loader: { flex: 1, justifyContent: "center" },
  title: { fontWeight: "bold", textAlign: "center", color: "white", marginTop: 10 },
  rating: { textAlign: "center", color: "white", marginTop: 35 },
  overview: { textAlign: "justify", color: "white", marginTop: 15, marginHorizontal: 10, fontSize: 16, lineHeight: 28 },
  buttonContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 },
  trailerButton: { backgroundColor: "#ff0000", paddingVertical: 16, paddingHorizontal: 28, borderRadius: 10, shadowColor: "#ff0000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 10 },
  trailerText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  heartButton: { marginLeft: 20, padding: 10, borderRadius: 50, backgroundColor: "transparent" }
});
