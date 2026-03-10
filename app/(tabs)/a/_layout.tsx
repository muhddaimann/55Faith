import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="main" options={{ title: "Main Form" }} />
      <Stack.Screen name="newsflash" options={{ title: "Main Form" }} />
      <Stack.Screen name="room" options={{ title: "Main Form" }} />
      <Stack.Screen name="history" options={{ title: "Booking History" }} />
      <Stack.Screen name="leave" options={{ title: "Main Form" }} />
    </Stack>
  );
}
