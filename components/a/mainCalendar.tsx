import React from "react";
import { Card, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Calendar } from "react-native-calendars";
import { AttendanceRecord } from "../../hooks/useAttendance";

type Props = {
  selectedDate: string | null;
  records: Record<string, AttendanceRecord>;
  onSelect: (date: string) => void;
};

export default function MainCalendar({
  selectedDate,
  records,
  onSelect,
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();

  const today = new Date().toISOString().split("T")[0];

  const statusColor = {
    on_duty: theme.colors.primary,
    off_day: theme.colors.secondary,
    public_holiday: theme.colors.tertiary ?? theme.colors.secondary,
    leave: theme.colors.error,
    absent: theme.colors.error,
  };

  const markedDates: any = {};

  Object.values(records).forEach((rec) => {
    markedDates[rec.date] = {
      customStyles: {
        container: {
          backgroundColor: statusColor[rec.status] + "20",
          borderRadius: 10,
        },
        text: {
          color: statusColor[rec.status],
          fontWeight: "600",
        },
      },
    };
  });

  if (today && today !== selectedDate) {
    markedDates[today] = {
      ...(markedDates[today] || {}),
      customStyles: {
        container: {
          ...(markedDates[today]?.customStyles?.container || {}),
          borderWidth: 1,
          borderColor: theme.colors.primary + "66",
          borderRadius: 10,
        },
        text: {
          ...(markedDates[today]?.customStyles?.text || {}),
          color: theme.colors.primary,
          fontWeight: "700",
        },
      },
    };
  }

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || {}),
      selected: true,
      selectedColor: theme.colors.primary,
      customStyles: {
        container: {
          ...(markedDates[selectedDate]?.customStyles?.container || {}),
          backgroundColor: theme.colors.primary,
          borderRadius: 10,
        },
        text: {
          ...(markedDates[selectedDate]?.customStyles?.text || {}),
          color: theme.colors.onPrimary,
          fontWeight: "700",
        },
      },
    };
  }

  return (
    <Card
      mode="elevated"
      style={{
        borderRadius: tokens.radii.xl,
        backgroundColor: theme.colors.surface,
        elevation: 2,
      }}
      contentStyle={{
        paddingTop: tokens.spacing.sm,
        paddingBottom: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.lg,
      }}
    >
      <Calendar
        markingType="custom"
        markedDates={markedDates}
        onDayPress={(day) => onSelect(day.dateString)}
        theme={{
          backgroundColor: theme.colors.surface,
          calendarBackground: theme.colors.surface,
          textSectionTitleColor: theme.colors.onSurfaceVariant,
          dayTextColor: theme.colors.onSurface,
          todayTextColor: theme.colors.primary,
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.onSurface,
          textMonthFontWeight: "700",
          textDayFontWeight: "500",
        }}
      />
    </Card>
  );
}
