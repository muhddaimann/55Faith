import React from "react";
import { View, Pressable } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHome } from "../../hooks/useHome";
import { useRouter } from "expo-router";

export default function Header() {
  const { colors } = useTheme();
  const tokens = useDesign();
  const { greeting, nickName, initials, designation } = useHome();
  const router = useRouter();

  const goProfile = () => {
    router.push("/b");
    setTimeout(() => {
      router.push("/b/update");
    }, 250);
  };

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
          {greeting}, {nickName}
        </Text>

        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          {designation}
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
          onPress={() => router.push("/a/newsflash")}
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

        <Pressable
          onPress={goProfile}
          style={({ pressed }) => ({
            width: 48,
            height: 48,
            borderRadius: tokens.radii.full,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scale: pressed ? 0.95 : 1 }],
          })}
        >
          <Text
            variant="titleMedium"
            style={{
              color: colors.onPrimary,
              fontWeight: "700",
            }}
          >
            {initials}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
