import { useState } from "react";

export type StatusType =
  | "on_duty"
  | "off_day"
  | "public_holiday"
  | "leave";

export type AttendanceRecord = {
  date: string;
  status: StatusType;
  start?: string;
  end?: string;
  note?: string;
};

const dummyMarch2026: Record<string, AttendanceRecord> = {
  "2026-03-01": { date: "2026-03-01", status: "off_day", note: "Weekend rest day" },
  "2026-03-02": { date: "2026-03-02", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-03": { date: "2026-03-03", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-04": { date: "2026-03-04", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-05": { date: "2026-03-05", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-06": { date: "2026-03-06", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-07": { date: "2026-03-07", status: "off_day", note: "Weekend rest day" },
  "2026-03-08": { date: "2026-03-08", status: "off_day", note: "Weekend rest day" },
  "2026-03-09": { date: "2026-03-09", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-10": { date: "2026-03-10", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-11": { date: "2026-03-11", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-12": { date: "2026-03-12", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-13": { date: "2026-03-13", status: "leave", note: "Annual leave approved" },
  "2026-03-14": { date: "2026-03-14", status: "off_day" },
  "2026-03-15": { date: "2026-03-15", status: "off_day" },
  "2026-03-16": { date: "2026-03-16", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-17": { date: "2026-03-17", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-18": { date: "2026-03-18", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-19": { date: "2026-03-19", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-20": { date: "2026-03-20", status: "public_holiday", note: "Public holiday" },
  "2026-03-21": { date: "2026-03-21", status: "off_day" },
  "2026-03-22": { date: "2026-03-22", status: "off_day" },
  "2026-03-23": { date: "2026-03-23", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-24": { date: "2026-03-24", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-25": { date: "2026-03-25", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-26": { date: "2026-03-26", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-27": { date: "2026-03-27", status: "leave", note: "Medical leave" },
  "2026-03-28": { date: "2026-03-28", status: "off_day" },
  "2026-03-29": { date: "2026-03-29", status: "off_day" },
  "2026-03-30": { date: "2026-03-30", status: "on_duty", start: "09:00", end: "18:00" },
  "2026-03-31": { date: "2026-03-31", status: "on_duty", start: "09:00", end: "18:00" },
};

export function useAttendance() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  const [records] = useState<Record<string, AttendanceRecord>>(dummyMarch2026);

  const selectDate = (date: string) => {
    setSelectedDate(date);
  };

  const record = selectedDate ? records[selectedDate] : undefined;

  return {
    selectedDate,
    selectDate,
    record,
    records,
  };
}