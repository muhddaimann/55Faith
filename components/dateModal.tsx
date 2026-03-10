import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { useDesign } from "../contexts/designContext";

type Mode = "SINGLE" | "RANGE";

type DatePickerProps = {
  mode?: Mode;
  initialDate?: string;
  initialRange?: { start: string; end: string };
  onConfirm: (value: string | { start: string; end: string }) => void;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function DatePicker({
  mode = "SINGLE",
  initialDate,
  initialRange,
  onConfirm,
}: DatePickerProps) {
  const theme = useTheme();
  const tokens = useDesign();

  const today = todayISO();

  const [single, setSingle] = useState(initialDate ?? today);
  const [range, setRange] = useState({
    start: initialRange?.start ?? "",
    end: initialRange?.end ?? "",
  });

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    if (today) {
      marks[today] = {
        ...(marks[today] || {}),
        customStyles: {
          container: {
            borderWidth: 1,
            borderColor: theme.colors.primary + "66",
            borderRadius: 10,
          },
          text: {
            color: theme.colors.primary,
            fontWeight: "700",
          },
        },
      };
    }

    if (mode === "SINGLE") {
      marks[single] = {
        selected: true,
        selectedColor: theme.colors.primary,
        customStyles: {
          container: {
            backgroundColor: theme.colors.primary,
            borderRadius: 10,
          },
          text: {
            color: theme.colors.onPrimary,
            fontWeight: "700",
          },
        },
      };
      return marks;
    }

    if (!range.start) return marks;

    if (!range.end) {
      marks[range.start] = {
        startingDay: true,
        endingDay: true,
        color: theme.colors.primary,
        textColor: theme.colors.onPrimary,
      };
      return marks;
    }

    let current = new Date(range.start);
    const end = new Date(range.end);

    while (current <= end) {
      const key = current.toISOString().slice(0, 10);

      marks[key] = {
        selected: true,
        color: theme.colors.primaryContainer,
        textColor: theme.colors.onPrimaryContainer,
        ...(key === range.start && {
          startingDay: true,
          color: theme.colors.primary,
          textColor: theme.colors.onPrimary,
        }),
        ...(key === range.end && {
          endingDay: true,
          color: theme.colors.primary,
          textColor: theme.colors.onPrimary,
        }),
      };

      current.setDate(current.getDate() + 1);
    }

    return marks;
  }, [mode, single, range, theme, today]);

  const canConfirm = mode === "SINGLE" || (!!range.start && !!range.end);

  const buttonLabel =
    mode === "SINGLE"
      ? `Confirm · ${formatDate(single)}`
      : range.start && range.end && range.start !== range.end
        ? `Confirm · ${formatDate(range.start)} – ${formatDate(range.end)}`
        : range.start
          ? `Confirm · ${formatDate(range.start)}`
          : "Confirm";

  return (
    <View
      style={{
        gap: tokens.spacing.md,
      }}
    >
      <View style={{ gap: 2 }}>
        <Text variant="titleMedium" style={{ fontWeight: "700" }}>
          {mode === "SINGLE" ? "Select Date" : "Select Date Range"}
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {mode === "SINGLE"
            ? "Tap a day to continue"
            : "Tap start date then end date"}
        </Text>
      </View>

      <Calendar
        markingType={mode === "RANGE" ? "period" : "custom"}
        markedDates={markedDates}
        onDayPress={(day) => {
          if (mode === "SINGLE") {
            setSingle(day.dateString);
            return;
          }

          const newDate = day.dateString;

          if (!range.start || range.end) {
            setRange({ start: newDate, end: "" });
            return;
          }

          if (newDate < range.start) {
            setRange({ start: newDate, end: range.start });
          } else {
            setRange({ start: range.start, end: newDate });
          }
        }}
        theme={{
          backgroundColor: theme.colors.surface,
          calendarBackground: theme.colors.surface,
          todayTextColor: theme.colors.primary,
          arrowColor: theme.colors.primary,
          textSectionTitleColor: theme.colors.onSurfaceVariant,
          dayTextColor: theme.colors.onSurface,
          monthTextColor: theme.colors.onSurface,
          textMonthFontWeight: "700",
          textDayFontWeight: "500",
        }}
      />

      <Button
        mode="contained"
        contentStyle={{ height: 48 }}
        style={{ borderRadius: tokens.radii.lg }}
        disabled={!canConfirm}
        onPress={() => onConfirm(mode === "SINGLE" ? single : range)}
      >
        {buttonLabel}
      </Button>
    </View>
  );
}
