import React, { useEffect, useRef, useState, useMemo } from "react";
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

type FilterValue = "upcoming" | "past";

export default function BookingHistoryPage() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar, onScroll } = useTabs();
  const scrollRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("upcoming");

  const { 
    activeBookings, 
    pastBookings, 
    loading, 
    refreshHomeData 
  } = useHome();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
    onScroll(offset);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const filteredData = useMemo(() => {
    return filter === "upcoming" ? activeBookings : pastBookings;
  }, [filter, activeBookings, pastBookings]);

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          bg: theme.colors.tertiaryContainer,
          text: theme.colors.onTertiaryContainer,
        };
      case "cancelled":
        return {
          bg: theme.colors.errorContainer,
          text: theme.colors.onErrorContainer,
        };
      case "pending":
        return {
          bg: theme.colors.primaryContainer,
          text: theme.colors.onPrimaryContainer,
        };
      default:
        return {
          bg: theme.colors.surfaceVariant,
          text: theme.colors.onSurfaceVariant,
        };
    }
  };

  const formatDateTime = (startStr: string, endStr: string) => {
    try {
      const start = new Date(startStr.replace(" ", "T"));
      const end = new Date(endStr.replace(" ", "T"));
      
      const datePart = start.toLocaleDateString("en-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      
      const startTime = start.toLocaleTimeString("en-MY", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      
      const endTime = end.toLocaleTimeString("en-MY", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return `${datePart} · ${startTime} - ${endTime}`;
    } catch (e) {
      return `${startStr} - ${endStr}`;
    }
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
          <Card
            mode="elevated"
            style={{
              borderRadius: tokens.radii.xl,
              backgroundColor: theme.colors.surface,
            }}
            contentStyle={{
              padding: tokens.spacing.md,
              gap: tokens.spacing.sm,
            }}
          >
            {filteredData.map((booking: any, index: number) => {
              const statusStyle = getStatusStyle(booking.Status);
              return (
                <View key={booking.booking_id || index}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: tokens.spacing.xs,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: tokens.spacing.sm,
                        flex: 1,
                      }}
                    >
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: theme.colors.surfaceVariant,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="door-open"
                          size={18}
                          color={theme.colors.primary}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          variant="bodyLarge"
                          style={{ fontWeight: "600" }}
                          numberOfLines={1}
                        >
                          {booking.Room_Name}
                        </Text>

                        <Text
                          variant="labelSmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          {formatDateTime(booking.Start_Date, booking.End_Date)}
                        </Text>
                      </View>
                    </View>

                    <Chip
                      compact
                      style={{
                        backgroundColor: statusStyle.bg,
                      }}
                      textStyle={{
                        color: statusStyle.text,
                        fontSize: 10,
                      }}
                    >
                      {booking.Status}
                    </Chip>
                  </View>

                  {index !== filteredData.length - 1 && (
                    <Divider style={{ marginVertical: 4, opacity: 0.5 }} />
                  )}
                </View>
              );
            })}
          </Card>
        )}
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}
