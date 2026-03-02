import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DesignProvider } from "../contexts/designContext";
import { ThemeProvider } from "../contexts/themeContext";
import { AuthProvider } from "../contexts/authContext";
import { TokenProvider } from "../contexts/tokenContext";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <TokenProvider>
        <AuthProvider>
          <DesignProvider>
            <ThemeProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
          </DesignProvider>
        </AuthProvider>
      </TokenProvider>
    </SafeAreaProvider>
  );
}
