import { useMemo, useEffect } from "react";
import { useTheme } from "react-native-paper";
import { useAttendanceStore } from "../contexts/api/attendanceStore";

export type StatusType = "work" | "rest_day" | "off_day" | "leave" | "absent";
export type StaffType = "operation" | "management";

export type TimingConfig = {
  label: string;
  color: string;
  bg: string;
  onBg: string;
  diff?: string | null;
};

export function useMain() {
  const { colors } = useTheme();
  const { 
    attendance, 
    holidays, 
    fetchAttendance, 
    fetchHolidays, 
    loading, 
    isInitialized 
  } = useAttendanceStore();

  useEffect(() => {
    fetchAttendance();
    fetchHolidays();
  }, [fetchAttendance, fetchHolidays]);

  const staffType: StaffType = useMemo(() => {
    if (!isInitialized) return "operation";
    return attendance ? "operation" : "management";
  }, [attendance, isInitialized]);

  const todayISO = useMemo(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  }, []);

  const cleanDescription = (desc?: string) => {
    if (!desc) return "";
    return desc.replace(/\*\*/g, "").replace(/[\r\n]+/g, " ").trim();
  };

  const publicHoliday = useMemo(() => {
    return holidays.find((h) => h.date === todayISO);
  }, [holidays, todayISO]);

  const status: StatusType = useMemo(() => {
    if (!attendance) return "work";
    
    const s = attendance.status?.toLowerCase();
    if (s === "work" || s === "working") return "work";
    if (s === "rd" || s === "rest") return "rest_day";
    if (s === "od" || s === "off") return "off_day";
    if (s === "leave" || s === "al" || s === "mc" || s === "sl") return "leave";
    if (s === "absent" || s === "abs") return "absent";
    
    return "work";
  }, [attendance]);

  const getTimingConfig = (type: 'login' | 'logout'): TimingConfig | null => {
    if (!attendance) return null;
    
    const apiStatus = type === 'login' ? attendance.login_status : attendance.logout_status;
    const actual = type === 'login' ? attendance.actual_login : attendance.actual_logout;
    const diff = type === 'login' ? attendance.login_difference : attendance.logout_difference;

    // If actual exists but diff is null, we show the time but NO status (Early/Late etc)
    if (!actual || actual === "") return null;
    if (!diff || diff === "") return null;

    const s = String(apiStatus).toLowerCase();
    
    if (s === "late") {
      return {
        label: "Late",
        color: colors.error,
        bg: colors.errorContainer,
        onBg: colors.onErrorContainer,
        diff
      };
    }
    if (s === "early") {
      return {
        label: "Early",
        color: colors.primary,
        bg: colors.primaryContainer,
        onBg: colors.onPrimaryContainer,
        diff
      };
    }
    if (s === "exact") {
      return {
        label: "On Time",
        color: colors.primary,
        bg: colors.primaryContainer,
        onBg: colors.onPrimaryContainer,
        diff
      };
    }
    
    return {
      label: s === "false" ? "" : s.charAt(0).toUpperCase() + s.slice(1),
      color: colors.onSurfaceVariant,
      bg: colors.surfaceVariant,
      onBg: colors.onSurfaceVariant,
      diff
    };
  };

  const loginConfig = useMemo(() => getTimingConfig('login'), [attendance, colors]);
  const logoutConfig = useMemo(() => getTimingConfig('logout'), [attendance, colors]);

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

  const holidayConfig = useMemo(
    () => ({
      label: "Public Holiday",
      icon: "calendar-star",
      bg: colors.tertiaryContainer ?? colors.secondaryContainer,
      color: colors.onTertiaryContainer ?? colors.onSecondaryContainer,
      name: cleanDescription(publicHoliday?.description) || "Public Holiday",
      message: cleanDescription(publicHoliday?.description) || "Happy holiday. Enjoy your day.",
    }),
    [colors, publicHoliday],
  );

  const current = statusConfig[status];

  const showStatus =
    staffType === "operation" ||
    (staffType === "management" && !publicHoliday);

  const showWorkingHours = status === "work";

  const formatTime = (time: string | null) => {
    if (!time) return null;
    try {
      if (time.includes("AM") || time.includes("PM")) return time;
      
      const parts = time.split(" ");
      const timePart = parts.length > 1 ? parts[1] : parts[0];
      
      const [h, m] = timePart.split(":");
      const hours = parseInt(h);
      const ampm = hours >= 12 ? "PM" : "AM";
      const h12 = hours % 12 || 12;
      return `${h12}:${m} ${ampm}`;
    } catch {
      return time;
    }
  };

  const start = useMemo(() => {
    if (!showWorkingHours) return undefined;
    if (staffType === "operation") {
      return formatTime(attendance?.original_login || "09:00:00") || "09:00 AM";
    }
    return "09:00 AM";
  }, [showWorkingHours, staffType, attendance]);

  const end = useMemo(() => {
    if (!showWorkingHours) return undefined;
    if (staffType === "operation") {
      return formatTime(attendance?.original_logout || "18:00:00") || "06:00 PM";
    }
    return "06:00 PM";
  }, [showWorkingHours, staffType, attendance]);

  const actualLogin = useMemo(() => formatTime(attendance?.actual_login || null), [attendance]);
  const actualLogout = useMemo(() => {
    if (!attendance?.logout_difference) return null;
    return formatTime(attendance?.actual_logout || null);
  }, [attendance]);

  const message = publicHoliday ? holidayConfig.message : current.message;

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
    isPublicHoliday: !!publicHoliday,
    current,
    holiday: holidayConfig,
    showStatus,
    showWorkingHours,
    start,
    end,
    actualLogin,
    actualLogout,
    loginConfig,
    logoutConfig,
    message,
    dateLabel,
    roleLabel,
    loading,
    refreshData: () => {
        fetchAttendance(true);
        fetchHolidays(true);
    },
  };
}
