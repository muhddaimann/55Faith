import { useMemo, useEffect, useCallback } from "react";
import { useLeaveStore } from "../contexts/api/leaveStore";
import { useBalanceStore } from "../contexts/api/balanceStore";
import {
  LEAVE_TYPES,
  LEAVE_PERIODS,
  LEAVE_REASONS,
  type LeaveItem,
} from "../constants/leave";

export type LeaveSummary = {
  annualLeaveLeft: number;
  pending: number;
  history: LeaveItem[];
};

export type SubmitLeavePayload = {
  leaveType: string;
  period: string;
  range: { start: string; end: string };
  reasonType: string;
  remarks: string;
  clinicId?: number;
  illness?: string;
  attachment?: {
    uri: string;
    name: string;
    type?: string;
  };
  attachmentRef?: string;
};

function diffDays(start: string, end: string): number {
  const s = new Date(`${start}T00:00:00`).getTime();
  const e = new Date(`${end}T00:00:00`).getTime();
  return Math.floor((e - s) / 86400000) + 1;
}

function resolveDuration(
  period: string,
  range: { start: string; end: string },
) {
  if (!range?.start) return "0";
  if (period === "Full Day") {
    if (!range.end) return "0";
    return String(diffDays(range.start, range.end));
  }
  return "0.5";
}

export default function useLeave() {
  const {
    leaves,
    fetchLeaves,
    loading,
    addNewLeave,
    withdraw,
    submitting,
    submissionError,
  } = useLeaveStore();
  const { annualLeaveLeft, balanceLoading, fetchBalance } = useBalanceStore();

  useEffect(() => {
    fetchLeaves();
    fetchBalance();
  }, [fetchLeaves, fetchBalance]);

  const leave = useMemo<LeaveSummary>(() => {
    // NO MAP HERE. Just raw items from store.
    // Calculations are deferred to individual components.
    return {
      annualLeaveLeft,
      pending: leaves.filter((l) => l.isPending).length,
      history: leaves,
    };
  }, [leaves, annualLeaveLeft]);

  const helpers = useMemo(
    () => ({
      diffDays,
    }),
    [],
  );

  const options = useMemo(
    () => ({
      leaveTypes: LEAVE_TYPES,
      leavePeriods: LEAVE_PERIODS,
      leaveReasons: LEAVE_REASONS,
    }),
    [],
  );

  const submitLeaveRequest = useCallback(
    async (payload: SubmitLeavePayload) => {
      const duration = resolveDuration(payload.period, payload.range);

      const selectedLeave = LEAVE_TYPES.find(
        (l) => l.value === payload.leaveType,
      );

      if (selectedLeave?.requiresAttachment && !payload.attachment) {
        return { success: false, error: "Attachment is required." };
      }

      const formData = new FormData();
      formData.append("leave_type", payload.leaveType);
      formData.append("leave_period", payload.period);
      formData.append("start_date", payload.range.start);
      formData.append("end_date", payload.range.end);
      formData.append("duration", duration);
      formData.append("reason", payload.reasonType);
      formData.append("remarks", payload.remarks);

      if (payload.clinicId) {
        formData.append("clinic_id", String(payload.clinicId));
      }

      if (payload.illness) {
        formData.append("illness", payload.illness);
      }

      if (payload.attachmentRef) {
        formData.append("document_ref_no", payload.attachmentRef);
      }

      if (payload.attachment) {
        formData.append("document_file", payload.attachment as any);
      }

      const result = await addNewLeave(formData);
      if (result.success) {
        await fetchBalance();
      }
      return result;
    },
    [addNewLeave, fetchBalance],
  );

  const withdrawRequest = useCallback(
    async (id: number) => {
      const result = await withdraw(id);
      if (result.success) {
        await fetchBalance();
      }
      return result;
    },
    [withdraw, fetchBalance],
  );

  return {
    leave,
    loading: loading || balanceLoading,
    options,
    helpers,
    submitLeaveRequest,
    withdrawRequest,
    submitting,
    submissionError,
  };
}
