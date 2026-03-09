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
  const { broadcasts, fetchBroadcasts, loading: broadcastLoading, markAcknowledged, acknowledge } = useBroadcastStore();
  const { myBookings, fetchBookings, loading: roomLoading } = useRoomStore();
  
  // Memoize greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  }, []);

  // Memoize staff info
  const staffInfo = useMemo(() => ({
    nickName: staff?.nick_name || staff?.by_name || "User",
    initials: staff?.initials ?? "U",
    designation: staff?.designation_name ?? "",
  }), [staff]);

  // Memoize Leave Data and Stats
  const leaveData = useMemo(() => {
    const pending = leaves.filter((l) => l.manager_status.toLowerCase() === "pending");
    const approved = leaves.filter((l) => l.manager_status.toLowerCase() === "approved");
    const rejected = leaves.filter((l) => l.manager_status.toLowerCase() === "rejected");
    
    return {
      all: leaves,
      pending,
      approved,
      rejected,
      pendingCount: pending.length,
      historyCount: leaves.length,
    };
  }, [leaves]);

  // Memoize Broadcast Data by Priority
  const broadcastData = useMemo(() => {
    const critical = broadcasts.filter((b) => b.BroadcastPriority === "Critical");
    const important = broadcasts.filter((b) => b.BroadcastPriority === "High" || b.BroadcastPriority === "Important");
    const normal = broadcasts.filter((b) => b.BroadcastPriority === "Normal" || b.BroadcastPriority === "Low" || !b.BroadcastPriority);
    
    return {
      all: broadcasts,
      critical,
      important,
      normal,
      count: broadcasts.length,
    };
  }, [broadcasts]);

  // Memoize Room stats
  const roomStats = useMemo(() => ({
    activeCount: myBookings.filter((b) => b.Tag === "Upcoming" && b.Status !== "Cancelled").length,
    historyCount: myBookings.length,
  }), [myBookings]);

  // Combined loading state
  const isHomeLoading = leavesLoading || balanceLoading || broadcastLoading || roomLoading;

  // Optimized refresh
  const refreshHomeData = useCallback(async () => {
    await Promise.allSettled([
      fetchLeaves(true),
      fetchBalance(true),
      fetchBroadcasts(true),
      fetchBookings(true)
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
    broadcasts: broadcastData.all,
    criticalBroadcasts: broadcastData.critical,
    importantBroadcasts: broadcastData.important,
    normalBroadcasts: broadcastData.normal,
    broadcastCount: broadcastData.count,
    activeBookingsCount: roomStats.activeCount,
    bookingHistoryCount: roomStats.historyCount,
    loading: isHomeLoading,
    refreshHomeData,
    fetchLeaves,
    fetchBalance,
    fetchBroadcasts,
    fetchBookings,
    markAcknowledged,
    acknowledge
  };
}
