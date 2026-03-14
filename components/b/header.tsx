import React from "react";
import { View } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useRouter } from "expo-router";
import { useHome } from "../../hooks/useHome";

export default function SettingsHeader() {
  const { colors } = useTheme();
  const tokens = useDesign();
  const router = useRouter();
  const { staff, initials, designation } = useHome();

  const nickName = staff?.nick_name || "User";
  const staffNo = staff?.staff_no || "";

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
          variant="headlineSmall"
          style={{
            color: colors.onPrimary,
            fontWeight: "700",
          }}
        >
          {initials}
        </Text>
      </View>

      <View
        style={{
          alignItems: "center",
          gap: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            gap: 6,
          }}
        >
          <Text
            variant="headlineMedium"
            style={{
              fontWeight: "700",
            }}
          >
            {nickName}
          </Text>

          {staffNo ? (
            <Text
              variant="labelLarge"
              style={{
                color: colors.primary,
                fontWeight: "600",
              }}
            >
              #{staffNo}
            </Text>
          ) : null}
        </View>

        <Text
          variant="bodySmall"
          style={{
            color: colors.onSurfaceVariant,
            textAlign: "center",
          }}
        >
          {designation || "Staff Position"}
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
