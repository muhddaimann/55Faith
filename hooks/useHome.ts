import { useMemo, useCallback, useState } from "react";
import { useStaffStore } from "../contexts/api/staffStore";
import { useLeaveStore } from "../contexts/api/leaveStore";
import { useBalanceStore } from "../contexts/api/balanceStore";
import { useBroadcastStore } from "../contexts/api/broadcastStore";
import { useRoomStore } from "../contexts/api/roomStore";
import { Room } from "../contexts/api/room";

export function useHome() {
  const { staff } = useStaffStore();
  const { leaves, fetchLeaves, loading: leavesLoading } = useLeaveStore();
  const { annualLeaveLeft, fetchBalance, balanceLoading } = useBalanceStore();
  const {
    broadcasts,
    fetchBroadcasts,
    loading: broadcastLoading,
    markAcknowledged,
    acknowledge,
  } = useBroadcastStore();
  const {
    myBookings,
    rooms,
    availability,
    fetchBookings,
    fetchRooms,
    fetchAvailability,
    createBooking,
    loading: roomLoading,
    cancelBooking,
  } = useRoomStore();

  // Memoize greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  }, []);

  // Memoize staff info
  const staffInfo = useMemo(
    () => ({
      nickName: staff?.nick_name || staff?.by_name || "User",
      initials: staff?.initials ?? "U",
      designation: staff?.designation_name ?? "",
    }),
    [staff],
  );

  // Memoize Leave Data and Stats
  const leaveData = useMemo(() => {
    const pending = leaves.filter(
      (l) => l.manager_status.toLowerCase() === "pending",
    );
    const approved = leaves.filter(
      (l) => l.manager_status.toLowerCase() === "approved",
    );
    const rejected = leaves.filter(
      (l) => l.manager_status.toLowerCase() === "rejected",
    );

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
    const important = broadcasts.filter(
      (b) => b.BroadcastPriority === "High" || b.BroadcastPriority === "Important",
    );
    const normal = broadcasts.filter(
      (b) =>
        b.BroadcastPriority === "Normal" ||
        b.BroadcastPriority === "Low" ||
        !b.BroadcastPriority,
    );

    return {
      all: broadcasts,
      critical,
      important,
      normal,
      count: broadcasts.length,
    };
  }, [broadcasts]);

  // Memoize Room stats and data
  const roomData = useMemo(() => {
    const active = myBookings.filter(
      (b) => b.Tag === "Upcoming" && b.Status !== "Cancelled",
    );
    const past = myBookings.filter((b) => b.Tag === "Past");
    const cancelled = myBookings.filter((b) => b.Status === "Cancelled");

    return {
      allBookings: myBookings,
      activeBookings: active,
      pastBookings: past,
      cancelledBookings: cancelled,
      activeCount: active.length,
      historyCount: myBookings.length,
      roomList: rooms,
    };
  }, [myBookings, rooms]);

  // Combined loading state
  const isHomeLoading =
    leavesLoading || balanceLoading || broadcastLoading || roomLoading;

  // Optimized refresh
  const refreshHomeData = useCallback(async () => {
    await Promise.allSettled([
      fetchLeaves(true),
      fetchBalance(true),
      fetchBroadcasts(true),
      fetchBookings(true),
      fetchRooms(true),
    ]);
  }, [fetchLeaves, fetchBalance, fetchBroadcasts, fetchBookings, fetchRooms]);

  return {
    greeting,
    staff,
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
    activeBookings: roomData.activeBookings,
    pastBookings: roomData.pastBookings,
    cancelledBookings: roomData.cancelledBookings,
    bookings: roomData.allBookings,
    activeBookingsCount: roomData.activeCount,
    bookingHistoryCount: roomData.historyCount,
    rooms: roomData.roomList,
    availability,
    loading: isHomeLoading,
    refreshHomeData,
    fetchLeaves,
    fetchBalance,
    fetchBroadcasts,
    fetchBookings,
    fetchRooms,
    fetchAvailability,
    createBooking,
    markAcknowledged,
    acknowledge,
    cancelBooking,
  };
}

export type SelectedSlot = {
  startTime: string; 
  endTime: string;   
};

// Helper to parse "12:30 AM" to minutes from start of day
const parseTimeToMinutes = (timeStr: string, isEnd: boolean = false) => {
  const [time, modifier] = timeStr.trim().split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  
  if (hours === 12) {
    hours = 0;
  }
  
  if (modifier === "PM") {
    hours += 12;
  }

  let totalMinutes = hours * 60 + minutes;
  
  // Special case: 12:00 AM as an END time means midnight (end of day)
  if (isEnd && timeStr.trim() === "12:00 AM") {
    totalMinutes = 1440;
  }
  
  return totalMinutes;
};

const parseRange = (rangeStr: string) => {
  const [start, end] = rangeStr.split(" - ");
  return {
    start,
    end,
    startMinutes: parseTimeToMinutes(start, false),
    endMinutes: parseTimeToMinutes(end, true)
  };
};

export default function useRoom(date: string) {
  const {
    rooms,
    availability,
    fetchAvailability,
    loading: roomsLoading,
    error,
  } = useRoomStore();

  const [selection, setSelection] = useState<SelectedSlot | null>(null);
  const [viewedBookingPurpose, setViewedBookingPurpose] = useState<string | null>(null);

  const formattedDate = useMemo(() => {
    const d = new Date(date);
    return d.toLocaleDateString("en-MY", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, [date]);

  const roomDetails = useMemo(() => {
    const map: Record<string, Room> = {};
    rooms.forEach((r) => {
      map[`${r.room_id}_${date}`] = r;
    });
    return map;
  }, [rooms, date]);

  const getTimeSlotRows = useCallback(
    (roomId: number) => {
      const key = `${roomId}_${date}`;
      const roomAvail = availability[key];
      if (!roomAvail) return [];

      const sortedKeys = Object.keys(roomAvail).sort((a, b) => {
        return parseRange(a).startMinutes - parseRange(b).startMinutes;
      });

      // Filter logic: Only hide if BOTH slots in an hour have passed
      const now = new Date();
      const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const currentHour = now.getHours();
      
      const rows: any[][] = [];
      // Group by hour blocks
      for (let i = 0; i < sortedKeys.length; i += 2) {
        const slot1 = sortedKeys[i];
        const slot2 = sortedKeys[i + 1];
        
        if (!slot1) continue;

        const info1 = parseRange(slot1);
        const hourOfRow = Math.floor(info1.startMinutes / 60);

        // Visibility Rule: If today, hide only if the hour of this row has passed
        if (date === localISO && hourOfRow < currentHour) {
          continue;
        }
        
        // Hide past dates entirely
        if (date < localISO) {
          continue;
        }

        const rowItems = [
          {
            time: slot1,
            status: roomAvail[slot1].status,
            purpose: roomAvail[slot1].event_name,
          }
        ];

        if (slot2) {
          rowItems.push({
            time: slot2,
            status: roomAvail[slot2].status,
            purpose: roomAvail[slot2].event_name,
          });
        }

        rows.push(rowItems);
      }
      
      return rows;
    },
    [availability, date],
  );

  const onSelectSlot = useCallback(
    (roomId: number, timeRange: string, slot: any) => {
      if (slot.status === "Booked") {
        setSelection(null);
        setViewedBookingPurpose(slot.purpose || "Private Meeting");
        return;
      }

      const { start, end, startMinutes, endMinutes } = parseRange(timeRange);
      setViewedBookingPurpose(null);

      setSelection((prev) => {
        // If nothing selected, pick this slot
        if (!prev) {
          return { startTime: start, endTime: end };
        }

        // If clicking the exact same slot that was already selected alone, toggle off
        if (start === prev.startTime && end === prev.endTime) {
          return null;
        }

        // SMART SELECTION LOGIC:
        // If we already have a multi-slot range selected, OR if the new click is far away,
        // we reset to a new single slot.
        const prevStartMin = parseTimeToMinutes(prev.startTime, false);
        const prevEndMin = parseTimeToMinutes(prev.endTime, true);
        const isSingleSlot = (prevEndMin - prevStartMin) === 30;

        if (!isSingleSlot) {
          return { startTime: start, endTime: end };
        }

        // Otherwise, expand the current single slot to a range
        if (startMinutes < prevStartMin) {
          return { startTime: start, endTime: prev.endTime };
        } else {
          return { startTime: prev.startTime, endTime: end };
        }
      });
    },
    [],
  );

  const isSlotSelected = useCallback(
    (roomId: number, timeRange: string) => {
      if (!selection) return false;
      const { startMinutes, endMinutes } = parseRange(timeRange);
      const selStart = parseTimeToMinutes(selection.startTime, false);
      const selEnd = parseTimeToMinutes(selection.endTime, true);

      return startMinutes >= selStart && endMinutes <= selEnd;
    },
    [selection],
  );

  const stableFetchAvailability = useCallback((roomId: number) => {
    return fetchAvailability(roomId, date);
  }, [fetchAvailability, date]);

  return useMemo(() => ({
    roomsLoading,
    availabilityLoading: {} as Record<string, boolean>,
    fetchAvailability: stableFetchAvailability,
    getTimeSlotRows,
    roomDetails,
    formattedDate,
    error,
    selection,
    onSelectSlot,
    isSlotSelected,
    viewedBookingPurpose,
  }), [
    roomsLoading,
    stableFetchAvailability,
    getTimeSlotRows,
    roomDetails,
    formattedDate,
    error,
    selection,
    onSelectSlot,
    isSlotSelected,
    viewedBookingPurpose
  ]);
}
