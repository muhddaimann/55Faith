import React from "react";
import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../contexts/designContext";

type Props = {
  title?: string;
  message?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export default function NoData({
  title = "No Data",
  message = "No attendance details for this date.",
  icon = "calendar-remove-outline",
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();

  return (
    <Card
      mode="elevated"
      style={{
        borderRadius: tokens.radii.xl,
        backgroundColor: theme.colors.surface,
        elevation: 1,
      }}
      contentStyle={{
        paddingVertical: tokens.spacing.xl,
        paddingHorizontal: tokens.spacing.lg,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: tokens.spacing.sm,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.background,
            padding: tokens.spacing.md,
            borderRadius: tokens.radii.lg,
          }}
        >
          <MaterialCommunityIcons
            name={icon}
            size={28}
            color={theme.colors.primary}
          />
        </View>

        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.onSurface,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {title}
        </Text>

        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            maxWidth: 260,
          }}
        >
          {message}
        </Text>
      </View>
    </Card>
  );
}
