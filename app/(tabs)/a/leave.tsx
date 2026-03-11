import React, { useCallback, useState } from "react";
import { ScrollView, View, RefreshControl, InteractionManager, Pressable } from "react-native";
import { useTheme, Button, Text, Card, Chip, Divider } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import useLeave, { LeaveItem } from "../../../hooks/useLeave";
import Header from "../../../components/header";
import TwoRow from "../../../components/a/twoRow";
import ScrollTop from "../../../components/scrollTop";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLoader } from "../../../contexts/loaderContext";
import { useOverlay } from "../../../contexts/overlayContext";
import { useFocusEffect, useRouter } from "expo-router";
import NoData from "../../../components/noData";

// Simplified Table for the new useLeave structure
function LeaveTable({ history, onLeavePress }: { history: any[], onLeavePress: (l: any) => void }) {
  const theme = useTheme();
  const tokens = useDesign();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const tabs = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const filtered = history.filter(item => {
    if (filter === "all") return true;
    return item.status.toLowerCase() === filter;
  });

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <View style={{ flexDirection: "row", backgroundColor: theme.colors.surfaceVariant, borderRadius: tokens.radii.lg, padding: 4 }}>
        {tabs.map(tab => (
          <Pressable
            key={tab.value}
            onPress={() => setFilter(tab.value as any)}
            style={{
              flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: tokens.radii.md,
              backgroundColor: filter === tab.value ? theme.colors.surface : "transparent"
            }}
          >
            <Text variant="labelLarge" style={{ color: filter === tab.value ? theme.colors.primary : theme.colors.onSurfaceVariant, fontWeight: filter === tab.value ? "700" : "500" }}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {filtered.length === 0 ? (
        <NoData title="No Applications" message="No leave records found for this filter." icon="calendar-blank" />
      ) : (
        filtered.map((item) => (
          <Card 
            key={item.id} 
            onPress={() => onLeavePress(item)}
            style={{ borderRadius: tokens.radii.lg, backgroundColor: theme.colors.surface }}
          >
            <View style={{ padding: tokens.spacing.md }}>
               <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text variant="titleMedium" style={{ fontWeight: "700" }}>{item.name}</Text>
                  <Chip compact style={{ backgroundColor: item.statusColors.container }} textStyle={{ color: item.statusColors.onContainer, fontSize: 10 }}>
                    {item.statusMeta.label}
                  </Chip>
               </View>
               <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <MaterialCommunityIcons name="calendar-range" size={14} color={theme.colors.onSurfaceVariant} />
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{item.dateRangeLabel}</Text>
               </View>
            </View>
          </Card>
        ))
      )}
    </View>
  );
}

export default function LeavePage() {
  const theme = useTheme();
  const tokens = useDesign();
  const router = useRouter();
  const { setHideTabBar } = useTabs();
  const { showLoader, hideLoader } = useLoader();
  const { showModal, hideModal, confirm, toast } = useOverlay();

  const {
    leave,
    loading,
    withdrawRequest,
    refreshLeaveData
  } = useLeave();

  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Consistent global loader for initial data fetch
  React.useEffect(() => {
    if (loading && leave.history.length === 0) {
      showLoader("Loading leave data...");
    } else if (!loading) {
      hideLoader();
    }
  }, [loading, leave.history.length, showLoader, hideLoader]);

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      return () => {
        setHideTabBar(false);
        hideModal();
      };
    }, [])
  );

  const handleScroll = (e: any) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleWithdraw = async (item: LeaveItem) => {
    hideModal();
    showLoader("Withdrawing...");
    try {
      const res = await withdrawRequest(Number(item.id));
      if (res.success) {
        toast({ message: "Withdrawn successfully", variant: "success" });
      } else {
        toast({ message: res.error || "Failed to withdraw", variant: "error" });
      }
    } finally {
      hideLoader();
    }
  };

  const handleLeavePress = (item: LeaveItem) => {
    showModal({
      content: (
        <View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}>
          <Text variant="headlineSmall" style={{ fontWeight: "800" }}>{item.name}</Text>
          <View style={{ gap: 4 }}>
             <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Date Range</Text>
             <Text variant="bodyLarge">{item.dateRangeLabel}</Text>
          </View>
          <View style={{ gap: 4 }}>
             <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Duration</Text>
             <Text variant="bodyLarge">{item.durationLabel} ({item.periodLabel})</Text>
          </View>
          {item.raw.reason && (
             <View style={{ gap: 4 }}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Reason</Text>
                <Text variant="bodyLarge">{item.raw.reason}</Text>
             </View>
          )}

          {item.isPending && (
            <Button 
              mode="contained" 
              buttonColor={theme.colors.error} 
              onPress={() => {
                confirm({
                  title: "Withdraw",
                  message: "Are you sure you want to withdraw this application?",
                  onConfirm: () => handleWithdraw(item)
                });
              }}
              style={{ marginTop: 8 }}
            >
              Withdraw Application
            </Button>
          )}
        </View>
      )
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"],
          gap: tokens.spacing.lg,
        }}
      >
        <Header title="Leave Application" subtitle="Manage your leave requests" showBack />

        <TwoRow
          left={{
            amount: leave.pending,
            label: "Pending Leave",
            icon: <MaterialCommunityIcons name="timer-sand" size={20} color={theme.colors.onPrimary} />,
            bgColor: theme.colors.primary,
            textColor: theme.colors.onPrimary,
            labelColor: theme.colors.onPrimary,
          }}
          right={{
            amount: leave.annualLeaveLeft,
            label: "AL Balance",
            icon: <MaterialCommunityIcons name="calendar-account-outline" size={20} color={theme.colors.onPrimaryContainer} />,
            bgColor: theme.colors.primaryContainer,
            textColor: theme.colors.onPrimaryContainer,
            labelColor: theme.colors.onPrimaryContainer,
          }}
        />

        <Button
          mode="contained-tonal"
          icon="plus"
          onPress={() => router.push("a/apply")}
          style={{ borderRadius: tokens.radii.pill }}
        >
          Add New Application
        </Button>

        <LeaveTable 
          history={leave.history}
          onLeavePress={handleLeavePress} 
        />
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}
