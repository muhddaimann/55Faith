import React from "react";
import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function MainCard() {
  const { colors } = useTheme();
  const tokens = useDesign();

  return (
    <Card
      mode="elevated"
      style={{
        marginHorizontal: tokens.spacing.lg,
        borderRadius: tokens.radii.xl,
        backgroundColor: colors.surface,
      }}
      contentStyle={{
        padding: tokens.spacing.lg,
        gap: tokens.spacing.lg,
      }}
    >
      <View style={{ gap: tokens.spacing.xs }}>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          Monday, 18 March 2026
        </Text>
        <Text variant="titleMedium" style={{ fontWeight: "600" }}>
          Management Level: Senior Executive
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tokens.spacing.sm,
        }}
      >
        <MaterialCommunityIcons
          name="check-circle"
          size={20}
          color={colors.primary}
        />
        <Text variant="titleSmall" style={{ fontWeight: "600" }}>
          Status: On Duty
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: tokens.spacing.sm,
        }}
      >
        <View style={{ gap: tokens.spacing.xs }}>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            Start Shift
          </Text>
          <Text variant="titleSmall" style={{ fontWeight: "600" }}>
            09:00 AM
          </Text>
        </View>

        <View style={{ gap: tokens.spacing.xs }}>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            End Shift
          </Text>
          <Text variant="titleSmall" style={{ fontWeight: "600" }}>
            06:00 PM
          </Text>
        </View>
      </View>
    </Card>
  );
}
