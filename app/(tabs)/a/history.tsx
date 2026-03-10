import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  ScrollView,
  View,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from "react-native";
import { Text, Card, useTheme, Divider, Chip } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import { useHome } from "../../../hooks/useHome";
import Header from "../../../components/header";
import ScrollTop from "../../../components/scrollTop";
import NoData from "../../../components/noData";
import BookingCard from "../../../components/a/bookingCard";
import BookingModalContent from "../../../components/a/bookingModal";
import { useOverlay } from "../../../contexts/overlayContext";
import { BookingItem } from "../../../contexts/api/room";
import { useLoader } from "../../../contexts/loaderContext";
import { useFocusEffect } from "expo-router";

type FilterValue = "upcoming" | "past";

export default function BookingHistoryPage() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();
  const { showModal, hideModal, confirm, toast } = useOverlay();
  const { showLoader, hideLoader } = useLoader();
  
  const scrollRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("upcoming");

  const { 
    activeBookings, 
    pastBookings, 
    loading, 
    refreshHomeData,
    cancelBooking 
  } = useHome();

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      return () => {
        setHideTabBar(false);
        hideModal();
      };
    }, [])
  );

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const filteredData = useMemo(() => {
    return filter === "upcoming" ? activeBookings : pastBookings;
  }, [filter, activeBookings, pastBookings]);

  const handleCancelConfirm = async (booking: BookingItem) => {
    hideModal();
    showLoader("Cancelling booking...");
    try {
      const res = await cancelBooking(booking.Booking_Num);
      if (res.execute_success) {
        toast({
          message: "Booking cancelled successfully",
          variant: "success"
        });
        await refreshHomeData();
      } else {
        toast({
          message: "Failed to cancel booking",
          variant: "error"
        });
      }
    } finally {
      hideLoader();
    }
  };

  const handleCancelInitiate = (booking: BookingItem) => {
    confirm({
      title: "Cancel Booking",
      message: `Are you sure you want to cancel your booking for ${booking.Room_Name} on ${booking.Start_Date}?`,
      confirmText: "Cancel Booking",
      isDestructive: true,
      onConfirm: () => handleCancelConfirm(booking)
    });
  };

  const handlePress = (booking: BookingItem) => {
    showModal({
      content: (
        <BookingModalContent
          booking={booking}
          onWithdraw={handleCancelInitiate}
        />
      )
    });
  };

  const tabs: { label: string; value: FilterValue }[] = [
    { label: "Upcoming", value: "upcoming" },
    { label: "Past Bookings", value: "past" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshHomeData} />
        }
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"],
          gap: tokens.spacing.lg,
        }}
      >
        <Header
          title="My Bookings"
          subtitle="Manage your room reservations"
          showBack
        />

        {/* Custom Tab Bar */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: tokens.radii.lg,
            padding: 4,
          }}
        >
          {tabs.map((tab) => {
            const isActive = filter === tab.value;
            return (
              <Pressable
                key={tab.value}
                onPress={() => setFilter(tab.value)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  alignItems: "center",
                  borderRadius: tokens.radii.md,
                  backgroundColor: isActive ? theme.colors.surface : "transparent",
                  elevation: isActive ? 2 : 0,
                }}
              >
                <Text
                  variant="labelLarge"
                  style={{
                    color: isActive ? theme.colors.primary : theme.colors.onSurfaceVariant,
                    fontWeight: isActive ? "700" : "500",
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {filteredData.length === 0 ? (
          <NoData 
            title={filter === "upcoming" ? "No Upcoming Bookings" : "No Past Bookings"}
            message={filter === "upcoming" 
              ? "You don't have any upcoming room reservations." 
              : "You haven't made any room bookings in the past."}
            icon="calendar-clock-outline"
          />
        ) : (
          <View style={{ gap: 0 }}>
            {filteredData.map((booking) => (
              <BookingCard
                key={booking.booking_id}
                booking={booking}
                onPress={handlePress}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}
