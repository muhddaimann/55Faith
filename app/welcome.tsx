import React, { useEffect } from "react";
import { View } from "react-native";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import { useDesign } from "../contexts/designContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Welcome() {
  const theme = useTheme();
  const tokens = useDesign();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/a");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: tokens.spacing["2xl"],
        gap: tokens.spacing.xl,
      }}
    >
      <View
        style={{
          height: 80,
          width: 80,
          borderRadius: 40,
          backgroundColor: theme.colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name="hand-wave-outline"
          size={40}
          color={theme.colors.primary}
        />
      </View>

      <View style={{ alignItems: "center", gap: tokens.spacing.sm }}>
        <Text
          variant="headlineSmall"
          style={{
            fontWeight: "700",
            textAlign: "center",
            letterSpacing: 0.3,
          }}
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
          Preparing your dashboard
        </Text>
      </View>

      <ActivityIndicator size="small" color={theme.colors.primary} />
    </View>
  );
}
