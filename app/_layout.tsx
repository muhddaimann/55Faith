import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DesignProvider } from "../contexts/designContext";
import { ThemeProvider } from "../contexts/themeContext";
import { OverlayProvider } from "../contexts/overlayContext";
import { NetworkProvider } from "../contexts/networkContext";
import { LoaderProvider } from "../contexts/loaderContext";
import { AuthProvider } from "../contexts/authContext";
import { TokenProvider } from "../contexts/tokenContext";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  SourceSansPro_400Regular,
  SourceSansPro_600SemiBold,
  SourceSansPro_700Bold,
} from "@expo-google-fonts/source-sans-pro";
import { useEffect } from "react";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
    SourceSansPro_700Bold,
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
        <DesignProvider>
          <ThemeProvider>
            <OverlayProvider>
              <NetworkProvider>
                <AuthProvider>
                  <LoaderProvider>
                    <View style={{ flex: 1 }}>
                      <Stack screenOptions={{ headerShown: false }} />
                    </View>
                  </LoaderProvider>
                </AuthProvider>
              </NetworkProvider>
            </OverlayProvider>
          </ThemeProvider>
        </DesignProvider>
      </TokenProvider>
    </SafeAreaProvider>
  );
}
