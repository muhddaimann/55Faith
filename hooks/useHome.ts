import { useMemo, useCallback } from "react";
import { useStaffStore } from "../contexts/api/staffStore";
import { useLeaveStore } from "../contexts/api/leaveStore";
import { useBalanceStore } from "../contexts/api/balanceStore";
import { useBroadcastStore } from "../contexts/api/broadcastStore";
import { useRoomStore } from "../contexts/api/roomStore";

export function useHome() {
  const { staff } = useStaffStore();
  const { leaves, fetchLeaves, loading: leavesLoading } = useLeaveStore();
  const { annualLeaveLeft, fetchBalance, balanceLoading } = useBalanceStore();
  const {
    broadcasts,
    fetchBroadcasts,
    loading: broadcastLoading,
  } = useBroadcastStore();
  const { myBookings, fetchBookings, loading: roomLoading } = useRoomStore();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  }, []);

  const staffInfo = useMemo(
    () => ({
      nickName: staff?.nick_name || staff?.by_name || "User",
      initials: staff?.initials ?? "U",
      designation: staff?.designation_name ?? "",
    }),
    [staff],
  );

  const leaveData = useMemo(() => {
    const pending = [];
    const approved = [];
    const rejected = [];

    for (const l of leaves) {
      const status = l.manager_status.toLowerCase();
      if (status === "pending") pending.push(l);
      else if (status === "approved") approved.push(l);
      else if (status === "rejected") rejected.push(l);
    }

    return {
      all: leaves,
      pending,
      approved,
      rejected,
      pendingCount: pending.length,
      historyCount: leaves.length,
    };
  }, [leaves]);

  const roomStats = useMemo(() => {
    let active = 0;

    for (const b of myBookings) {
      if (b.Tag === "Upcoming" && b.Status !== "Cancelled") active++;
    }

    return {
      activeCount: active,
      historyCount: myBookings.length,
    };
  }, [myBookings]);

  const isHomeLoading =
    leavesLoading || balanceLoading || broadcastLoading || roomLoading;

  const refreshHomeData = useCallback(async () => {
    await Promise.allSettled([
      fetchLeaves(true),
      fetchBalance(true),
      fetchBroadcasts(true),
      fetchBookings(true),
    ]);
  }, [fetchLeaves, fetchBalance, fetchBroadcasts, fetchBookings]);

  return {
    greeting,
    ...staffInfo,
    leaves: leaveData.all,
    pendingLeaves: leaveData.pending,
    approvedLeaves: leaveData.approved,
    rejectedLeaves: leaveData.rejected,
    pendingLeavesCount: leaveData.pendingCount,
    leaveHistoryCount: leaveData.historyCount,
    annualLeaveLeft,
    broadcasts,
    activeBookingsCount: roomStats.activeCount,
    bookingHistoryCount: roomStats.historyCount,
    loading: isHomeLoading,
    refreshHomeData,
    fetchLeaves,
    fetchBalance,
    fetchBroadcasts,
    fetchBookings,
  };
}
