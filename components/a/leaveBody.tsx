import React, { useEffect } from "react";
import { View } from "react-native";
import { useTheme, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../../contexts/designContext";
import { useLoader } from "../../contexts/loaderContext";
import useLeave from "../../hooks/useLeave";
import TwoRow from "./twoRow";
import LeaveTable from "./leaveTable";

export default function LeaveBody() {
  const theme = useTheme();
  const tokens = useDesign();
  const router = useRouter();
  const { leave, loading } = useLeave();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (loading && leave.history.length === 0) {
      showLoader("Loading leave applications...");
    } else if (!loading) {
      hideLoader();
    }
    
    return () => hideLoader();
  }, [loading, leave.history.length, showLoader, hideLoader]);

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <TwoRow
        left={{
          amount: leave.pending,
          label: "Pending Leave",
          icon: (
            <MaterialCommunityIcons
              name="timer-sand"
              size={20}
              color={theme.colors.onPrimary}
            />
          ),
          bgColor: theme.colors.primary,
          textColor: theme.colors.onPrimary,
          labelColor: theme.colors.onPrimary,
        }}
        right={{
          amount: leave.annualLeaveLeft,
          label: "AL Balance",
          icon: (
            <MaterialCommunityIcons
              name="calendar-account-outline"
              size={20}
              color={theme.colors.onPrimaryContainer}
            />
          ),
          bgColor: theme.colors.primaryContainer,
          textColor: theme.colors.onPrimaryContainer,
          labelColor: theme.colors.onPrimaryContainer,
        }}
      />

      <Button
        mode="outlined"
        icon="plus"
        onPress={() => router.push("a/apply")}
        style={{ borderRadius: tokens.radii.pill }}
      >
        Add New Application
      </Button>

      <LeaveTable history={leave.history} />
    </View>
  );
}
