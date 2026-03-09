import React, { useEffect } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { useDesign } from "../contexts/designContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Goodbye() {
  const theme = useTheme();
  const tokens = useDesign();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
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
          backgroundColor: theme.colors.errorContainer,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name="logout"
          size={40}
          color={theme.colors.error}
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
          Goodbye
        </Text>

        <Text
          variant="bodyMedium"
          style={{
            textAlign: "center",
            color: theme.colors.onSurfaceVariant,
          }}
        >
          You have successfully logged out.
        </Text>
      </View>
    </View>
  );
}
