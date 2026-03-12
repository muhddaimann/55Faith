import { Leave } from "../contexts/api/leave";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type LeaveStatusTone = "secondary" | "tertiary" | "error" | "neutral";

export type LeaveStatusMeta = {
  label: string;
  tone: LeaveStatusTone;
};

export type LeaveStatusColors = {
  container: string;
  onContainer: string;
};

export type LeaveOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  isMedical?: boolean;
  requiresAttachment?: boolean;
};

export type LeaveItem = {
  id: string;
  type: string;
  name: string;
  status: LeaveStatus;
  statusMeta: LeaveStatusMeta;
  periodLabel: string;
  dateLabel: string;
  dateRangeLabel: string;
  durationLabel: string;
  returnLabel?: string;
  days: number;
  isSingleDay: boolean;
  isCancelled: boolean;
  isPending: boolean;
  raw: Leave;
};

export const LEAVE_STATUS_META: Record<LeaveStatus, LeaveStatusMeta> = {
  PENDING: { label: "Pending", tone: "secondary" },
  APPROVED: { label: "Approved", tone: "tertiary" },
  REJECTED: { label: "Rejected", tone: "error" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

export const LEAVE_TYPES: LeaveOption<
  | "AL"
  | "SL"
  | "UL"
  | "RL"
  | "MR"
  | "PL"
  | "CL"
  | "ML"
  | "CAL"
  | "HL"
  | "PGL"
  | "PH"
  | "GL"
  | "EL"
  | "WFH"
>[] = [
  { label: "Annual Leave", value: "AL" },
  {
    label: "Sick Leave",
    value: "SL",
    isMedical: true,
    requiresAttachment: true,
  },
  { label: "Unpaid Leave", value: "UL" },
  { label: "Replacement Leave", value: "RL" },
  { label: "Marriage Leave", value: "MR" },
  { label: "Paternity Leave", value: "PL" },
  { label: "Compassionate Leave", value: "CL" },
  { label: "Maternity Leave", value: "ML", isMedical: true },
  { label: "Calamity Leave", value: "CAL" },
  {
    label: "Hospitalisation",
    value: "HL",
    isMedical: true,
    requiresAttachment: true,
  },
  { label: "Pilgrimage Leave", value: "PGL" },
  { label: "Public Holiday", value: "PH" },
  { label: "Garden Leave", value: "GL" },
  {
    label: "Emergency Leave",
    value: "EL",
    requiresAttachment: true,
  },
  {
    label: "Work From Home",
    value: "WFH",
    requiresAttachment: true,
  },
];

export const LEAVE_PERIODS: LeaveOption[] = [
  { value: "Full Day", label: "Full Day" },
  { value: "1st Half Day", label: "First Half Day" },
  { value: "2nd Half Day", label: "Second Half Day" },
];

export const LEAVE_REASONS: LeaveOption[] = [
  { value: "Personal", label: "Personal" },
  { value: "Back To Hometown", label: "Back To Hometown" },
  { value: "Family Matters", label: "Family matters" },
  { value: "Medical", label: "Medical appointment" },
  { value: "Emergency", label: "Emergency" },
  { value: "Others", label: "Others" },
];

// Formatting Utilities
export function formatDate(date: string) {
  if (!date) return "";
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function buildDateRangeLabel(start: string, end: string) {
  if (!start) return "";
  if (start === end || !end) return formatDate(start);
  return `${formatDate(start)} → ${formatDate(end)}`;
}

export function buildReturnLabel(endDate?: string) {
  if (!endDate) return undefined;
  const d = new Date(`${endDate}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return `Return: ${formatDate(d.toISOString().slice(0, 10))}`;
}

export function resolveStatus(l: Leave): LeaveStatus {
  if (
    l.cancellation_dt ||
    l.cancellation_action === "CANCELLED" ||
    l.manager_status === "Cancelled"
  ) {
    return "CANCELLED";
  }
  if (l.manager_status === "Approved") return "APPROVED";
  if (l.manager_status === "Rejected") return "REJECTED";
  return "PENDING";
}

export function transformLeave(l: Leave): LeaveItem {
  const status = resolveStatus(l);
  const days = Number(l.duration) || 1;
  const statusMeta = LEAVE_STATUS_META[status];

  return {
    id: String(l.leave_id),
    type: l.leave_type,
    name: l.leave_name,
    status,
    statusMeta,
    periodLabel: l.leave_period,
    dateLabel: formatDate(l.start_date),
    dateRangeLabel: buildDateRangeLabel(l.start_date, l.end_date),
    durationLabel: `${days} day${days !== 1 ? "s" : ""}`,
    returnLabel:
      status !== "CANCELLED" ? buildReturnLabel(l.end_date) : undefined,
    days,
    isSingleDay: days === 1,
    isCancelled: status === "CANCELLED",
    isPending: status === "PENDING",
    raw: l,
  };
}
