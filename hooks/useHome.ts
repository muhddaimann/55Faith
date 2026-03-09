import { useMemo, useEffect, useCallback, useState } from "react";
import { useStaffStore } from "../contexts/api/staffStore";
import { useLeaveStore } from "../contexts/api/leaveStore";
import { useBalanceStore } from "../contexts/api/balanceStore";
import { useBroadcastStore } from "../contexts/api/broadcastStore";
import { useRoomStore } from "../contexts/api/roomStore";
import { getActiveBroadcasts } from "../contexts/api/broadcast";
import { useLoader } from "../contexts/loaderContext";

export function useHome() {
  const { staff } = useStaffStore();
  const { leaves, fetchLeaves, loading: leavesLoading } = useLeaveStore();
  const { annualLeaveLeft, fetchBalance, balanceLoading } = useBalanceStore();
  const { broadcasts, setBroadcasts } = useBroadcastStore();
  const { myBookings, fetchBookings, loading: roomLoading } = useRoomStore();
  const { showLoader, hideLoader } = useLoader();
  
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  }, []);

  const nickName = staff?.nick_name || staff?.by_name || "User";
  const initials = staff?.initials ?? "U";
  const designation = staff?.designation_name ?? "";

  const pendingLeavesCount = useMemo(() => {
    return leaves.filter((l) => l.manager_status.toLowerCase() === "pending").length;
  }, [leaves]);

  const leaveHistoryCount = useMemo(() => {
    return leaves.length;
  }, [leaves]);

  const activeBookingsCount = useMemo(() => {
    return myBookings.filter((b) => b.Tag === "Upcoming" && b.Status !== "Cancelled").length;
  }, [myBookings]);

  const bookingHistoryCount = useMemo(() => {
    return myBookings.length;
  }, [myBookings]);

  const fetchBroadcasts = useCallback(async () => {
    setBroadcastLoading(true);
    try {
      const res = await getActiveBroadcasts();
      if (res?.status === "success" && res.data) {
        setBroadcasts(res.data);
      }
    } finally {
      setBroadcastLoading(false);
    }
  }, [setBroadcasts]);

  const refreshHomeData = useCallback(async () => {
    showLoader("Refreshing data...");
    try {
      await Promise.all([
        fetchLeaves(),
        fetchBalance(),
        fetchBroadcasts(),
        fetchBookings()
      ]);
    } finally {
      hideLoader();
    }
  }, [fetchLeaves, fetchBalance, fetchBroadcasts, fetchBookings, showLoader, hideLoader]);

  // Auto-fetch on mount
  useEffect(() => {
    if (leaves.length === 0 && !leavesLoading) {
      fetchLeaves();
    }
    fetchBalance();
    fetchBroadcasts();
    if (myBookings.length === 0 && !roomLoading) {
      fetchBookings();
    }
  }, []);

  return {
    greeting,
    nickName,
    initials,
    designation,
    pendingLeavesCount,
    leaveHistoryCount,
    annualLeaveLeft,
    broadcasts,
    activeBookingsCount,
    bookingHistoryCount,
    loading: leavesLoading || balanceLoading || broadcastLoading || roomLoading,
    refreshHomeData,
  };
}
