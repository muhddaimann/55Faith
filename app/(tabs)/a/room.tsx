import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Text, Card, useTheme, Divider, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHome } from "../../../hooks/useHome";
import { useOverlay } from "../../../contexts/overlayContext";
import DateModal from "../../../components/dateModal";
import RoomSummary from "../../../components/a/roomSummary";
import ScrollTop from "../../../components/scrollTop";
import { useRouter } from "expo-router";

export default function RoomPage() {
  const theme = useTheme();
  const tokens = useDesign();
  const router = useRouter();
  const { setHideTabBar, onScroll } = useTabs();
  const { showModal, hideModal } = useOverlay();

  const scrollViewRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const {
    rooms,
    activeBookingsCount,
    loading,
    refreshHomeData,
    fetchRooms,
    fetchBookings,
  } = useHome();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    setHideTabBar(true);
    fetchRooms();
    fetchBookings();
    return () => setHideTabBar(false);
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
    onScroll(offset);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleDatePress = () => {
    showModal({
      content: (
        <DateModal
          initialDate={selectedDate}
          mode="SINGLE"
          onConfirm={(date) => {
            setSelectedDate(date as string);
            hideModal();
          }}
        />
      ),
    });
  };

  const handleHistoryPress = () => {
    router.push("/a/history");
  };

  const groupedRooms = rooms.reduce((acc: any, room) => {
    const key = `${room.Tower} - ${room.Level}`;
    if (!acc[key]) {
      acc[key] = {
        tower: room.Tower,
        level: room.Level,
        list: [],
      };
    }
    acc[key].list.push(room);
    return acc;
  }, {});

  const groupKeys = Object.keys(groupedRooms);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView
          ref={scrollViewRef}
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
            title="Room Booking"
            subtitle="Browse available rooms"
            showBack
          />

          <RoomSummary
            selectedDate={selectedDate}
            activeBookingsCount={activeBookingsCount}
            onDatePress={handleDatePress}
            onHistoryPress={handleHistoryPress}
          />

          {groupKeys.length === 0 && !loading ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <MaterialCommunityIcons
                name="office-building-marker-outline"
                size={48}
                color={theme.colors.onSurfaceVariant}
                style={{ opacity: 0.3 }}
              />
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}
              >
                No rooms found.
              </Text>
            </View>
          ) : (
            groupKeys.map((key) => {
              const group = groupedRooms[key];
              return (
                <View key={key} style={{ gap: tokens.spacing.md }}>
                  <View>
                    <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                      {group.tower}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      {group.level}
                    </Text>
                  </View>

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
                    {group.list.map((room: any, idx: number) => (
                      <View key={room.room_id}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
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
                                width: 32,
                                height: 32,
                                borderRadius: 16,
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
                            <View>
                              <Text
                                variant="bodyLarge"
                                style={{ fontWeight: "600" }}
                              >
                                {room.Room_Name}
                              </Text>
                              <Text
                                variant="labelSmall"
                                style={{
                                  color: theme.colors.onSurfaceVariant,
                                }}
                              >
                                Capacity: {room.Capacity} Pax
                              </Text>
                            </View>
                          </View>

                          <Button
                            mode="contained-tonal"
                            compact
                            onPress={() => {}}
                            style={{ borderRadius: tokens.radii.md }}
                          >
                            Book
                          </Button>
                        </View>

                        {idx !== group.list.length - 1 && (
                          <Divider style={{ marginVertical: 4 }} />
                        )}
                      </View>
                    ))}
                  </Card>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}