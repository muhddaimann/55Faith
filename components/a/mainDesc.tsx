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
      label: record.apiStatus === "RD" ? "Rest Day" : "Off Day",
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
    absent: {
      label: "Absent",
      icon: "alert-circle",
      color: colors.error,
      bg: colors.errorContainer,
      onBg: colors.onErrorContainer,
    },
  };

  const config = record.holidayName
    ? statusConfig.public_holiday
    : statusConfig[record.status] || statusConfig.off_day;

  const dateObj = new Date(record.date);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const worked =
    record.status === "on_duty" ||
    (record.holidayName && record.checkIn) ||
    (record.status === "absent" && record.checkIn);

  const getStatusColor = (status?: string) => {
    if (!status) return colors.onSurfaceVariant;
    const s = status.toLowerCase();
    if (s === "late") return colors.error;
    if (s === "early" || s === "exact") return colors.primary;
    return colors.onSurfaceVariant;
  };

  const getStatusLabel = (status?: string) => {
    if (!status || status === "false") return "";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card
      mode="elevated"
      style={{
        borderRadius: tokens.radii.xl,
        backgroundColor: colors.surface,
      }}
    >
      <Card.Content style={{ gap: tokens.spacing.sm }}>
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

        {record.holidayName && (
          <View
            style={{
              backgroundColor: config.bg,
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.sm,
            }}
          >
            <MaterialCommunityIcons
              name="calendar-star"
              size={20}
              color={config.onBg}
            />
            <Text
              variant="bodyMedium"
              style={{ fontWeight: "700", color: config.onBg }}
            >
              {record.holidayName}
            </Text>
          </View>
        )}

        {worked ? (
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    variant="labelSmall"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Check In
                  </Text>
                  <Text
                    variant="labelSmall"
                    style={{
                      color: getStatusColor(record.loginStatus),
                      fontWeight: "700",
                    }}
                  >
                    {getStatusLabel(record.loginStatus)}
                  </Text>
                </View>
                <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                  {record.checkIn || "--:--"}
                </Text>
                {record.lateMinutes ? (
                  <Text variant="labelSmall" style={{ color: colors.error }}>
                    {record.lateMinutes} mins late
                  </Text>
                ) : null}
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    variant="labelSmall"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Check Out
                  </Text>
                  {record.logoutDifference && (
                    <Text
                      variant="labelSmall"
                      style={{
                        color: getStatusColor(record.logoutStatus),
                        fontWeight: "700",
                      }}
                    >
                      {getStatusLabel(record.logoutStatus)}
                    </Text>
                  )}
                </View>
                <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                  {record.checkOut || "--:--"}
                </Text>
                {record.overtimeMinutes && record.logoutDifference ? (
                  <Text variant="labelSmall" style={{ color: colors.primary }}>
                    {record.overtimeMinutes} mins OT
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: colors.surfaceVariant,
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
            }}
          >
            <Text
              variant="bodyMedium"
              style={{
                color: colors.onSurfaceVariant,
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              {record.holidayName
                ? record.holidayName
                : record.status === "off_day"
                  ? record.apiStatus === "RD"
                    ? "Today is a scheduled rest day."
                    : "Enjoy your day off."
                  : record.status === "leave"
                    ? "You’re currently on leave."
                    : record.status === "absent"
                      ? "No attendance recorded for this work day."
                      : "No schedule for this date."}
            </Text>
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
