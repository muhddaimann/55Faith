import React from "react";
import { View } from "react-native";
import { Text, Card, Chip, useTheme, Divider } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Leave } from "../../contexts/api/leave";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  leave: Leave;
  onPress: (leave: Leave) => void;
};

export default React.memo(function LeaveCard({ leave, onPress }: Props) {
  const theme = useTheme();
  const tokens = useDesign();

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return {
          bg: theme.colors.tertiaryContainer,
          text: theme.colors.onTertiaryContainer,
          icon: "check-circle",
        };
      case "pending":
        return {
          bg: theme.colors.primaryContainer,
          text: theme.colors.onPrimaryContainer,
          icon: "timer-sand",
        };
      case "rejected":
        return {
          bg: theme.colors.errorContainer,
          text: theme.colors.onErrorContainer,
          icon: "close-circle",
        };
      default:
        return {
          bg: theme.colors.surfaceVariant,
          text: theme.colors.onSurfaceVariant,
          icon: "help-circle",
        };
    }
  };

  const statusStyle = getStatusStyle(leave.manager_status);

  return (
    <Card
      mode="elevated"
      onPress={() => onPress(leave)}
      style={{
        marginBottom: tokens.spacing.md,
        borderRadius: tokens.radii.lg,
        backgroundColor: theme.colors.surface,
      }}
    >
      <View style={{ padding: tokens.spacing.md }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: tokens.spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.md,
              flex: 1,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.primaryContainer,
              }}
            >
              <MaterialCommunityIcons
                name="calendar-text"
                size={20}
                color={theme.colors.primary}
              />
            </View>

            <View>
              <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                {leave.leave_name}
              </Text>

              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {leave.duration_name}
              </Text>
            </View>
          </View>

          <Chip
            compact
            style={{ backgroundColor: statusStyle.bg }}
            textStyle={{ color: statusStyle.text, fontSize: 11 }}
          >
            {leave.manager_status}
          </Chip>
        </View>

        <Divider style={{ marginBottom: tokens.spacing.sm }} />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: tokens.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.xs,
            }}
          >
            <MaterialCommunityIcons
              name="calendar-range"
              size={14}
              color={theme.colors.onSurfaceVariant}
            />

            <Text
              variant="bodySmall"
              style={{
                opacity: 0.8,
                color: theme.colors.onSurfaceVariant,
              }}
            >
              {leave.date}
            </Text>
          </View>

          {leave.reason && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: tokens.spacing.xs,
              }}
            >
              <MaterialCommunityIcons
                name="comment-text-outline"
                size={14}
                color={theme.colors.onSurfaceVariant}
              />

              <Text
                variant="bodySmall"
                style={{
                  opacity: 0.8,
                  color: theme.colors.onSurfaceVariant,
                }}
                numberOfLines={1}
              >
                {leave.reason}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
});
