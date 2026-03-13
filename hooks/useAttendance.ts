import { useState, useMemo, useEffect, useCallback } from "react";
import { useAttendanceStore } from "../contexts/api/attendanceStore";
import { Attendance } from "../contexts/api/attendance";

export type StatusType = "on_duty" | "off_day" | "public_holiday" | "leave" | "absent";

export type AttendanceRecord = {
  date: string;
  status: StatusType;
  statusLabel?: string; // Mapped label like "Rest Day"
  apiStatus: string; // Raw status from API like "RD", "ABS", "AL"

  shiftStart?: string;
  shiftEnd?: string;

  checkIn?: string;
  checkOut?: string;

  lateMinutes?: number;
  overtimeMinutes?: number;
  
  loginStatus?: string; // early, late, exact
  logoutStatus?: string;
  loginDifference?: string | null;
  logoutDifference?: string | null;

  note?: string;
  holidayName?: string;
};

function extractTime(dateTimeStr: string | null): string | undefined {
  if (!dateTimeStr || dateTimeStr.trim() === "") return undefined;
  if (dateTimeStr.length <= 8) return formatToAMPM(dateTimeStr);
  
  const parts = dateTimeStr.split(" ");
  if (parts.length >= 2) return formatToAMPM(parts[1]);
  
  return undefined;
}

function formatToAMPM(timeStr: string): string {
  if (!timeStr) return "";
  if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
  
  try {
    const [h, m] = timeStr.split(":");
    const hours = parseInt(h);
    const ampm = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 || 12;
    const min = m ? m.substring(0, 2) : "00";
    return `${h12}:${min} ${ampm}`;
  } catch {
    return timeStr;
  }
}

function mapStatus(apiStatus: string): StatusType {
  const s = apiStatus.toUpperCase();
  if (s === "WORK" || s === "WORKING") return "on_duty";
  if (s === "RD" || s === "REST") return "off_day";
  if (s === "OD" || s === "OFF") return "off_day";
  if (s === "PH" || s === "HOLIDAY") return "public_holiday";
  if (s === "ABS" || s === "ABSENT") return "absent";
  // Default for others (AL, MC, etc)
  return "leave";
}

export function useAttendance() {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  }, []);

  const cleanDescription = (desc?: string) => {
    if (!desc) return "";
    return desc.replace(/\*\*/g, "").replace(/[\r\n]+/g, " ").trim();
  };

  const { attendanceRecords, holidays, fetchAttendance, fetchHolidays, loading } = useAttendanceStore();

  const [selectedDate, setSelectedDate] = useState<string | null>(today);

  useEffect(() => {
    fetchAttendance();
    fetchHolidays();
  }, [fetchAttendance, fetchHolidays]);

  const records = useMemo(() => {
    const map: Record<string, AttendanceRecord> = {};
    
    attendanceRecords.forEach((att: Attendance) => {
      const date = att.schedule_date;
      
      const parseDiff = (diffStr: string | null) => {
        if (!diffStr) return 0;
        const match = diffStr.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };

      const holiday = holidays.find(h => h.date?.trim() === date?.trim());

      map[date] = {
        date,
        status: mapStatus(att.status),
        apiStatus: att.status,
        shiftStart: extractTime(att.original_login),
        shiftEnd: extractTime(att.original_logout),
        checkIn: extractTime(att.actual_login),
        checkOut: att.logout_difference ? extractTime(att.actual_logout) : undefined,
        lateMinutes: att.login_status === 'late' ? parseDiff(att.login_difference) : undefined,
        overtimeMinutes: att.logout_status === 'late' ? parseDiff(att.logout_difference) : undefined,
        loginStatus: att.login_status,
        logoutStatus: att.logout_status,
        loginDifference: att.login_difference,
        logoutDifference: att.logout_difference,
        note: att.remarks || att.reason || undefined,
        holidayName: cleanDescription(holiday?.description),
      };
    });
    
    return map;
  }, [attendanceRecords, holidays]);

  const selectDate = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const record = selectedDate ? records[selectedDate] : undefined;

  return {
    selectedDate,
    selectDate,
    record,
    records,
    loading,
    refresh: () => {
      fetchAttendance(true);
      fetchHolidays(true);
    },
  };
}
