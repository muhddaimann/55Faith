import React from "react";
import { View } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useRouter } from "expo-router";

export default function SettingsHeader() {
  const { colors } = useTheme();
  const tokens = useDesign();
  const router = useRouter();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingTop: tokens.spacing.lg,
        paddingBottom: tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.lg,
        alignItems: "center",
        gap: tokens.spacing.md,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
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

      <View
        style={{
          alignItems: "center",
          gap: 2,
        }}
      >
        <Text
          variant="titleMedium"
          style={{
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Adam Faizal Bin Rahman
        </Text>

        <Text
          variant="bodySmall"
          style={{
            color: colors.onSurfaceVariant,
            textAlign: "center",
          }}
        >
          Software Engineer · IT Department
        </Text>
      </View>
      <Button
        mode="outlined"
        icon="account-edit-outline"
        compact
        onPress={() => router.push("b/update")}
        style={{
          borderRadius: tokens.radii.full,
        }}
        contentStyle={{
          paddingHorizontal: tokens.spacing.lg,
        }}
      >
        Update Details
      </Button>
    </View>
  );
}
