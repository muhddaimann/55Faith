import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, clearStoredToken } from "./tokenContext";
import {
  login as apiLogin,
  logout as apiLogout,
  AuthResponse,
} from "./api/auth";
import { jwtDecode } from "jwt-decode";
import { OverlayConfirm } from "../components/confirm";
import { OverlayAlert } from "../components/alert";
import { router } from 'expo-router';

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
  } catch (e) {
    return true;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [showExpiredAlert, setShowExpiredAlert] = useState(false);

  const handleSignOut = async () => {
    try {
      await apiLogout();
      await clearStoredToken();
      setUser(null);
      router.replace("/goodbye");
    } catch (e) {
      console.error("Failed to delete session", e);
    } finally {
      setConfirmSignOut(false);
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await getToken();
        if (token) {
          if (isTokenExpired(token)) {
            await clearStoredToken();
            setUser(null);
            setShowExpiredAlert(true);
          } else {
            setUser({ status: "success", token });
          }
        }
      } catch (e) {
        console.error("Failed to load session", e);
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
      const response = await apiLogin({ username, password });
      if (response.status === "success") {
        setUser(response);
      }
      return response;
    } catch (e) {
      console.error("Login failed", e);
      return { status: "error", message: "An unexpected error occurred" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut: () => setConfirmSignOut(true),
      }}
    >
      {children}

      <OverlayConfirm
        visible={confirmSignOut}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        onConfirm={handleSignOut}
        onCancel={() => setConfirmSignOut(false)}
        isDestructive
      />

      <OverlayAlert
        visible={showExpiredAlert}
        title="Session Expired"
        message="Your session has expired. Please login again."
        onClose={() => setShowExpiredAlert(false)}
      />
    </AuthContext.Provider>
  );
};
