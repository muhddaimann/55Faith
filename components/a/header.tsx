import React from "react";
import { View, Pressable } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Header() {
  const { colors } = useTheme();
  const tokens = useDesign();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingTop: tokens.spacing.sm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flex: 1,
          gap: 2,
        }}
      >
        <Text variant="titleMedium" style={{ color: colors.primary }}>
          F A I T H
        </Text>

        <Text variant="titleMedium" style={{ fontWeight: "600" }}>
          Good Morning, Adam
        </Text>

        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          Software Engineer
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tokens.spacing.md,
        }}
      >
        <Pressable
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: tokens.radii.full,
            backgroundColor: colors.surfaceVariant,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scale: pressed ? 0.95 : 1 }],
          })}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={22}
            color={colors.onSurfaceVariant}
          />
        </Pressable>

        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: tokens.radii.full,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            variant="titleMedium"
            style={{
              color: colors.onPrimary,
              fontWeight: "700",
            }}
          >
            AF
          </Text>
        </View>
      </View>
    </View>
  );
}
