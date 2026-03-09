import React from "react";
import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { AttendanceRecord } from "../../hooks/useAttendance";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NoData from "../noData";

type Props = {
  record?: AttendanceRecord;
};

export default function MainDescription({ record }: Props) {
  const { colors } = useTheme();
  const tokens = useDesign();

  if (!record) {
    return (
      <NoData
        icon="calendar-remove-outline"
        title="No Attendance"
        message="No attendance details for this date."
      />
    );
  }

  const statusConfig = {
    on_duty: {
      label: "On Duty",
      icon: "check-circle",
      color: colors.primary,
      bg: colors.primaryContainer,
      onBg: colors.onPrimaryContainer,
    },
    off_day: {
      label: "Off Day",
      icon: "weather-night",
      color: colors.secondary,
      bg: colors.secondaryContainer,
      onBg: colors.onSecondaryContainer,
    },
    public_holiday: {
      label: "Public Holiday",
      icon: "calendar-star",
      color: colors.tertiary ?? colors.secondary,
      bg: colors.tertiaryContainer ?? colors.secondaryContainer,
      onBg: colors.onTertiaryContainer ?? colors.onSecondaryContainer,
    },
    leave: {
      label: "On Leave",
      icon: "beach",
      color: colors.error,
      bg: colors.errorContainer,
      onBg: colors.onErrorContainer,
    },
  };

  const config = statusConfig[record.status];

  const dateObj = new Date(record.date);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const worked =
    record.status === "on_duty" ||
    (record.status === "public_holiday" && record.checkIn);

  return (
    <Card
      mode="elevated"
      style={{
        borderRadius: tokens.radii.xl,
        backgroundColor: colors.surface,
      }}
    >
      <Card.Content style={{ gap: tokens.spacing.lg }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text variant="titleMedium" style={{ fontWeight: "700" }}>
            {formattedDate}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: config.bg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: tokens.radii.md,
            }}
          >
            <MaterialCommunityIcons
              name={config.icon as any}
              size={16}
              color={config.onBg}
            />
            <Text
              variant="labelSmall"
              style={{ color: config.onBg, fontWeight: "700" }}
            >
              {config.label}
            </Text>
          </View>
        </View>

        {worked && (
          <View style={{ gap: tokens.spacing.md }}>
            {(record.shiftStart || record.shiftEnd) && (
              <View
                style={{
                  backgroundColor: colors.surfaceVariant,
                  padding: tokens.spacing.md,
                  borderRadius: tokens.radii.lg,
                  gap: 2,
                }}
              >
                <Text
                  variant="labelSmall"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Shift
                </Text>
                <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                  {record.shiftStart || "--:--"} - {record.shiftEnd || "--:--"}
                </Text>
              </View>
            )}

            <View style={{ flexDirection: "row", gap: tokens.spacing.md }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surfaceVariant,
                  padding: tokens.spacing.md,
                  borderRadius: tokens.radii.lg,
                  gap: 2,
                }}
              >
                <Text
                  variant="labelSmall"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Check In
                </Text>
                <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                  {record.checkIn || "--:--"}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surfaceVariant,
                  padding: tokens.spacing.md,
                  borderRadius: tokens.radii.lg,
                  gap: 2,
                }}
              >
                <Text
                  variant="labelSmall"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Check Out
                </Text>
                <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                  {record.checkOut || "--:--"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {record.note && (
          <View
            style={{
              backgroundColor: colors.surfaceVariant,
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              borderLeftWidth: 4,
              borderLeftColor: config.color,
            }}
          >
            <Text
              variant="bodySmall"
              style={{
                fontStyle: "italic",
                color: colors.onSurfaceVariant,
              }}
            >
              "{record.note}"
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}
