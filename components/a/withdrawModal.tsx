import React from "react";
import { View } from "react-native";
import { Text, Button, Divider, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Leave } from "../../contexts/api/leave";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  leave: Leave;
  onConfirm: (leave: Leave) => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function WithdrawModalContent({
  leave,
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();

  return (
    <View style={{ gap: tokens.spacing.lg }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.errorContainer,
          }}
        >
          <MaterialCommunityIcons
            name="alert-outline"
            size={24}
            color={theme.colors.error}
          />
        </View>
        <Text variant="headlineSmall" style={{ fontWeight: "700" }}>
          Withdraw Leave?
        </Text>
      </View>

      <Text
        variant="bodyMedium"
        style={{
          color: theme.colors.onSurfaceVariant,
        }}
      >
        Are you sure you want to withdraw your{" "}
        <Text style={{ fontWeight: "700", color: theme.colors.onSurface }}>
          {leave.leave_name}
        </Text>{" "}
        application for{" "}
        <Text style={{ fontWeight: "700", color: theme.colors.onSurface }}>
          {leave.date}
        </Text>
        ? This action cannot be undone.
      </Text>

      <Divider />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 8,
        }}
      >
        <Button
          mode="text"
          onPress={onCancel}
          disabled={loading}
          style={{ borderRadius: tokens.radii.md }}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={() => onConfirm(leave)}
          loading={loading}
          disabled={loading}
          style={{ borderRadius: tokens.radii.md }}
          buttonColor={theme.colors.error}
          textColor={theme.colors.onError}
        >
          Withdraw
        </Button>
      </View>
    </View>
  );
}
