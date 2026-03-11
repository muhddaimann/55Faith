import React, { useEffect } from "react";
import { View } from "react-native";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import { useDesign } from "../contexts/designContext";
import { useAuth } from "../contexts/authContext";
import { useHome } from "../hooks/useHome";
import useLeave from "../hooks/useLeave";

export default function Welcome() {
  const theme = useTheme();
  const tokens = useDesign();
  const { user } = useAuth();
  
  const { 
    fetchBroadcasts, 
    fetchBookings, 
    fetchRooms 
  } = useHome();

  const {
    refreshLeaveData
  } = useLeave();

  useEffect(() => {
    const prepareDashboard = async () => {
      const startTime = Date.now();
      
      // Fetch all essential data in parallel
      await Promise.allSettled([
        refreshLeaveData(),
        fetchBroadcasts(),
        fetchBookings(),
        fetchRooms()
      ]);

      // Ensure the user sees the welcome screen for at least 1.5 seconds for a smooth transition
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1500 - elapsed);

      setTimeout(() => {
        router.replace("/(tabs)/a");
      }, remaining);
    };

    prepareDashboard();
  }, [refreshLeaveData, fetchBroadcasts, fetchBookings, fetchRooms]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: tokens.spacing.xl,
        gap: tokens.spacing.lg,
      }}
    >
      <Text
        variant="headlineMedium"
        style={{ fontWeight: "700", textAlign: "center" }}
      >
        Welcome Back
      </Text>

      <Text
        variant="bodyMedium"
        style={{
          textAlign: "center",
          color: theme.colors.onSurfaceVariant,
        }}
      >
        Preparing your dashboard...
      </Text>

      <ActivityIndicator size="small" color={theme.colors.primary} />
    </View>
  );
}
