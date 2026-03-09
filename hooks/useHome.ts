import { useMemo } from "react";
import { useStaffStore } from "../contexts/api/staffStore";

export function useHome() {
  const { staff } = useStaffStore();

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

  return {
    greeting,
    nickName,
    initials,
    designation,
  };
}