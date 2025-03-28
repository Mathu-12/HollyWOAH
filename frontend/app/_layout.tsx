import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Main Pages */}
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="homepage" options={{ title: "Home Page" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      
      {/* Movie Details Page (Displayed as Modal) */}
      <Stack.Screen
        name="movie/[id]"
        options={{
          title: "Movie Details",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
