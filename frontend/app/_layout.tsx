import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="login" />
      <Stack.Screen name="homepage" />
      {/* Movie Details Page (Hidden in Bottom Tabs) */}
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