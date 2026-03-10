import React, { useCallback, useState } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import { useHome } from "../../../hooks/useHome";
import { useLeaveStore } from "../../../contexts/api/leaveStore";
import { useBalanceStore } from "../../../contexts/api/balanceStore";
import Header from "../../../components/header";
import TwoRow from "../../../components/a/twoRow";
import LeaveTable from "../../../components/a/leaveTable";
import LeaveModalContent from "../../../components/a/leaveModal";
import WithdrawModalContent from "../../../components/a/withdrawModal";
import ScrollTop from "../../../components/scrollTop";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Leave } from "../../../contexts/api/leave";
import { useLoader } from "../../../contexts/loaderContext";
import { useOverlay } from "../../../contexts/overlayContext";
import { useFocusEffect } from "expo-router";

export default function LeavePage() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();
  const { showLoader, hideLoader } = useLoader();
  const { showModal, hideModal } = useOverlay();

  const {
    leaves,
    pendingLeaves,
    approvedLeaves,
    rejectedLeaves,
    pendingLeavesCount,
    annualLeaveLeft,
    loading: isHomeLoading,
    refreshHomeData,
    fetchLeaves,
    fetchBalance
  } = useHome();

  const { 
    withdraw, 
    loading: leavesStoreLoading, 
    isInitialized: leaveInitialized 
  } = useLeaveStore();
  
  const { 
    isInitialized: balanceInitialized 
  } = useBalanceStore();

  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  const isFullyInitialized = leaveInitialized && balanceInitialized;

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      
      const initData = async () => {
        if (!isFullyInitialized) {
          showLoader("Loading leave applications...");
        }
        try {
          await Promise.all([fetchLeaves(), fetchBalance()]);
        } finally {
          hideLoader();
        }
      };

      initData();
      return () => {
        setHideTabBar(false);
        hideLoader();
        hideModal();
      };
    }, [isFullyInitialized])
  );

  const handleScroll = (e: any) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleWithdrawConfirm = async (leave: Leave) => {
    hideModal();
    showLoader("Withdrawing leave...");
    try {
      const res = await withdraw(leave.leave_id);
      if (res.success) {
        await refreshHomeData();
      }
    } finally {
      hideLoader();
    }
  };

  const handleWithdrawInitiate = (leave: Leave) => {
    showModal({
      content: (
        <WithdrawModalContent
          leave={leave}
          onConfirm={handleWithdrawConfirm}
          onCancel={hideModal}
          loading={leavesStoreLoading}
        />
      )
    });
  };

  const handleLeavePress = (leave: Leave) => {
    showModal({
      content: (
        <LeaveModalContent
          leave={leave}
          onWithdraw={handleWithdrawInitiate}
        />
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
        refreshControl={
          <RefreshControl refreshing={isHomeLoading} onRefresh={refreshHomeData} />
        }
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"],
          gap: tokens.spacing.lg,
        }}
      >
        <Header
          title="Leave Application"
          subtitle="Manage your leave requests"
          showBack
        />

        {isFullyInitialized && (
          <>
            <TwoRow
              left={{
                amount: pendingLeavesCount,
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
                amount: annualLeaveLeft,
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

            <LeaveTable 
              leaves={leaves}
              pending={pendingLeaves}
              approved={approvedLeaves}
              rejected={rejectedLeaves}
              onLeavePress={handleLeavePress} 
            />
          </>
        )}
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}
