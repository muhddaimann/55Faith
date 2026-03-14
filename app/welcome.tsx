import React, { useEffect } from "react";
import { View, Image } from "react-native";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import { useDesign } from "../contexts/designContext";
import { useHome } from "../hooks/useHome";
import useLeave from "../hooks/useLeave";

export default function Welcome() {
  const theme = useTheme();
  const tokens = useDesign();

  const { fetchBroadcasts, fetchBookings, fetchRooms } = useHome();

  const {} = useLeave();

  useEffect(() => {
    const prepareDashboard = async () => {
      const startTime = Date.now();

      await Promise.allSettled([
        fetchBroadcasts(),
        fetchBookings(),
        fetchRooms(),
      ]);

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1200 - elapsed);

      setTimeout(() => {
        router.replace("/(tabs)/a");
      }, remaining);
    };

    prepareDashboard();
  }, [fetchBroadcasts, fetchBookings, fetchRooms]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: tokens.spacing.lg,
        gap: tokens.spacing.md,
      }}
    >
      <Image
        source={require("../assets/images/d3.png")}
        style={{
          width: 64,
          height: 64,
          resizeMode: "contain",
          marginBottom: tokens.spacing.sm,
        }}
      />

      <Text
        variant="headlineSmall"
        style={{
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        Welcome back
      </Text>

      <Text
        variant="bodySmall"
        style={{
          textAlign: "center",
          color: theme.colors.onSurfaceVariant,
        }}
      >
        Preparing your dashboard
      </Text>

      <ActivityIndicator
        size="small"
        color={theme.colors.primary}
        style={{ marginTop: tokens.spacing.sm }}
      />
    </View>
  );
}
