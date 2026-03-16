import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, clearStoredToken } from "./tokenContext";
import {
  login as apiLogin,
  logout as apiLogout,
  AuthResponse,
} from "./api/auth";
import { jwtDecode } from "jwt-decode";
import { useOverlay } from "./overlayContext";
import { router } from "expo-router";
import { useStaffStore } from "./api/staffStore";
import { useAttendanceStore } from "./api/attendanceStore";
import { useBalanceStore } from "./api/balanceStore";
import { useBroadcastStore } from "./api/broadcastStore";
import { useLeaveStore } from "./api/leaveStore";
import { useRoomStore } from "./api/roomStore";
import { useSessionStore } from "./api/sessionStore";

type AuthContextType = {
  user: AuthResponse | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<AuthResponse>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { alert, confirm, toast } = useOverlay();
  const { isExpired, setExpired } = useSessionStore();

  const resetStores = () => {
    useStaffStore.getState().clear();
    useAttendanceStore.getState().clear();
    useBalanceStore.getState().clear();
    useBroadcastStore.getState().clear();
    useLeaveStore.getState().clear();
    useRoomStore.getState().clear();
  };

  const handleSignOut = async (redirectTo: string = "/goodbye") => {
    try {
      await apiLogout();
    } catch {}

    try {
      await clearStoredToken();
    } catch {}

    resetStores();
    setUser(null);
    router.replace(redirectTo as any);
  };

  useEffect(() => {
    if (isExpired) {
      handleSignOut("/");
      alert({
        title: "Session Expired",
        message: "Your session has expired. Please login again.",
      });
      setExpired(false);
    }
  }, [isExpired]);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await getToken();
        if (token) {
          if (isTokenExpired(token)) {
            await clearStoredToken();
            resetStores();
            setUser(null);
            alert({
              title: "Session Expired",
              message: "Your session has expired. Please login again.",
            });
          } else {
            setUser({ status: "success", token });
            await useStaffStore.getState().fetchStaff();
          }
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const signIn = async (
    username: string,
    password: string,
  ): Promise<AuthResponse> => {
    try {
      resetStores();

      const response = await apiLogin({ username, password });

      if (response.status === "success") {
        setUser(response);
        await useStaffStore.getState().fetchStaff();

        const currentStaff = useStaffStore.getState().staff;
        const name = currentStaff?.nick_name || "User";

        toast(`Welcome back, ${name}!`);
      }

      return response;
    } catch {
      return { status: "error", message: "An unexpected error occurred" };
    }
  };

  const signOut = () => {
    confirm({
      title: "Sign Out",
      message: "Are you sure you want to sign out?",
      confirmText: "Sign Out",
      onConfirm: () => handleSignOut("/goodbye"),
      isDestructive: true,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
