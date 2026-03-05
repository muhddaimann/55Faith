import { useMemo, useState } from "react";
import { useTheme } from "react-native-paper";

export type StatusType = "work" | "rest_day" | "off_day" | "leave" | "absent";
export type StaffType = "operation" | "management";

export function useMain() {
  const { colors } = useTheme();

  const [staffType, setStaffType] = useState<StaffType>("operation");
  const [status, setStatus] = useState<StatusType>("work");
  const [isPublicHoliday, setIsPublicHoliday] = useState(false);

  const attendance = {
    start: "09:00 AM",
    end: "06:00 PM",
  };

  const toggleStaffType = () => {
    setStaffType((p) => (p === "operation" ? "management" : "operation"));
  };

  const toggleHoliday = () => {
    setIsPublicHoliday((p) => !p);
  };

  const toggleStatus = () => {
    if (staffType === "management") return;

    const order: StatusType[] = [
      "work",
      "rest_day",
      "off_day",
      "leave",
      "absent",
    ];

    const index = order.indexOf(status);
    const next = order[(index + 1) % order.length];
    setStatus(next);
  };

  const statusConfig = useMemo(
    () => ({
      work: {
        key: "work",
        label: "Work",
        icon: "briefcase-check",
        bg: colors.primaryContainer,
        color: colors.onPrimaryContainer,
        message: "",
      },
      rest_day: {
        key: "rest_day",
        label: "Rest Day",
        icon: "bed-outline",
        bg: colors.secondaryContainer,
        color: colors.onSecondaryContainer,
        message: "Today is a scheduled rest day.",
      },
      off_day: {
        key: "off_day",
        label: "Off Day",
        icon: "weather-night",
        bg: colors.secondaryContainer,
        color: colors.onSecondaryContainer,
        message: "Enjoy your day off.",
      },
      leave: {
        key: "leave",
        label: "Leave",
        icon: "beach",
        bg: colors.errorContainer,
        color: colors.onErrorContainer,
        message: "You’re currently on leave.",
      },
      absent: {
        key: "absent",
        label: "Absent",
        icon: "alert-circle",
        bg: colors.errorContainer,
        color: colors.onErrorContainer,
        message: "No attendance recorded.",
      },
    }),
    [colors],
  );

  const holiday = useMemo(
    () => ({
      label: "Public Holiday",
      icon: "calendar-star",
      bg: colors.tertiaryContainer ?? colors.secondaryContainer,
      color: colors.onTertiaryContainer ?? colors.onSecondaryContainer,
      name: "Hari Raya Aidilfitri",
      message: "Happy holiday. Enjoy your day.",
    }),
    [colors],
  );

  const current = statusConfig[status];

  const showStatus =
    staffType === "operation" ||
    (staffType === "management" && !isPublicHoliday);

  const showWorkingHours =
    status === "work" && !(staffType === "management" && isPublicHoliday);

  const start = showWorkingHours ? attendance.start : undefined;
  const end = showWorkingHours ? attendance.end : undefined;

  const message =
    staffType === "management" && isPublicHoliday
      ? holiday.message
      : current.message;

  const dateLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  }, []);

  const roleLabel = staffType === "operation" ? "CD Agent" : "Management";

  return {
    staffType,
    toggleStaffType,
    toggleHoliday,
    toggleStatus,
    isPublicHoliday,
    current,
    holiday,
    showStatus,
    showWorkingHours,
    start,
    end,
    message,
    dateLabel,
    roleLabel,
  };
}
