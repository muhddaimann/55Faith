import React from "react";
import { View, ScrollView } from "react-native";
import { Text, Button, Divider, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Leave } from "../../contexts/api/leave";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  leave: Leave;
  onWithdraw?: (leave: Leave) => void;
};

export default function LeaveModalContent({
  leave,
  onWithdraw,
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  const isPending = leave.manager_status.toLowerCase() === "pending";

  const DetailItem = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value: string;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: tokens.spacing.md,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: tokens.radii.md,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surfaceVariant,
        }}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color={theme.colors.primary}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          variant="labelSmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {label}
        </Text>
        <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ gap: tokens.spacing.lg }}>
      <View>
        <Text variant="headlineSmall" style={{ fontWeight: "700" }}>
          Leave Details
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Review your leave information
        </Text>
      </View>

      <Divider />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 400 }}
      >
        <View style={{ gap: tokens.spacing.lg }}>
          <DetailItem
            icon="calendar-text"
            label="Leave Type"
            value={leave.leave_name}
          />

          <DetailItem
            icon="calendar-range"
            label="Duration"
            value={`${leave.date} (${leave.duration_name})`}
          />

          <DetailItem
            icon="clock-outline"
            label="Period"
            value={leave.leave_period}
          />

          <DetailItem
            icon="check-decagram-outline"
            label="Status"
            value={leave.manager_status}
          />

          {leave.reason && (
            <DetailItem
              icon="comment-text-outline"
              label="Reason"
              value={leave.reason}
            />
          )}

          {leave.remarks && (
            <DetailItem
              icon="note-text-outline"
              label="Remarks"
              value={leave.remarks}
            />
          )}
        </View>
      </ScrollView>

      {isPending && onWithdraw && (
        <Button
          mode="outlined"
          onPress={() => onWithdraw(leave)}
          style={{ borderColor: theme.colors.error }}
          textColor={theme.colors.error}
        >
          Withdraw Leave
        </Button>
      )}
    </View>
  );
}
