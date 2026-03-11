import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  ScrollView,
  View,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  Image,
} from "react-native";
import { Text, Card, useTheme, Divider } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHome } from "../../../hooks/useHome";
import { useOverlay } from "../../../contexts/overlayContext";
import { useLoader } from "../../../contexts/loaderContext";
import DateModal from "../../../components/dateModal";
import RoomSummary from "../../../components/a/roomSummary";
import ScrollTop from "../../../components/scrollTop";
import { useRouter, useFocusEffect } from "expo-router";
import NoData from "../../../components/noData";
import RoomModalContent from "../../../components/a/roomModal";

export default function RoomPage() {
  const theme = useTheme();
  const tokens = useDesign();
  const router = useRouter();
  const { setHideTabBar } = useTabs();
  const { showModal, hideModal } = useOverlay();
  const { showLoader, hideLoader } = useLoader();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [collapsedTowers, setCollapsedTowers] = useState<Record<string, boolean>>({});
  const {
    rooms,
    activeBookingsCount,
    loading,
    refreshHomeData,
    fetchRooms,
    fetchBookings,
  } = useHome();

  // Consistent global loader for initial data fetch
  useEffect(() => {
    if (loading && rooms.length === 0) {
      showLoader("Loading rooms...");
    } else if (!loading) {
      hideLoader();
    }
  }, [loading, rooms.length, showLoader, hideLoader]);

  const getLocalISO = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(getLocalISO());
  const groupedRooms = rooms.reduce((acc: any, room: any) => {
    const tower = room.Tower;
    const level = room.Level;
    
    if (!acc[tower]) acc[tower] = {};
    if (!acc[tower][level]) acc[tower][level] = [];
    
    acc[tower][level].push(room);
    return acc;
  }, {});

  const towers = Object.keys(groupedRooms).sort();

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      fetchRooms();
      fetchBookings();
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
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const toggleTower = (tower: string) => {
    setCollapsedTowers(prev => ({
      ...prev,
      [tower]: !prev[tower]
    }));
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

  const handleConfirmSlots = (room: any, start: string, end: string) => {
    hideModal();
    router.push({
      pathname: "/a/book",
      params: {
        room_id: room.room_id,
        room_name: room.Room_Name,
        tower: room.Tower,
        level: room.Level,
        date: selectedDate,
        start_time: start,
        end_time: end
      }
    });
  };

  const handleBookPress = (room: any) => {
    showModal({
      content: (
        <RoomModalContent
          room={room}
          date={selectedDate}
          onClose={hideModal}
          onConfirm={(start, end) => handleConfirmSlots(room, start, end)}
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
          onHistoryPress={() => router.push("/a/history")}
        />

        {towers.length === 0 && !loading ? (
          <NoData 
            title="No Rooms Available"
            message="We couldn't find any meeting rooms at this time."
            icon="office-building-marker-outline"
          />
        ) : (
          towers.map((tower) => {
            const levels = Object.keys(groupedRooms[tower]).sort();
            const isCollapsed = collapsedTowers[tower] || false;
            
            return (
              <View key={tower} style={{ gap: tokens.spacing.md }}>
                <Pressable 
                  onPress={() => toggleTower(tower)}
                  style={({ pressed }) => ({
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    paddingVertical: 4,
                    opacity: pressed ? 0.7 : 1
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <MaterialCommunityIcons name="office-building" size={18} color={theme.colors.primary} />
                    <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                      {tower}
                    </Text>
                  </View>
                  <MaterialCommunityIcons 
                    name={isCollapsed ? "chevron-down" : "chevron-up"} 
                    size={20} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                </Pressable>

                {!isCollapsed && levels.map((level) => (
                  <View key={`${tower}-${level}`} style={{ gap: tokens.spacing.xs }}>
                    <View style={{ paddingLeft: 4 }}>
                      <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600' }}>
                        {level}
                      </Text>
                    </View>
                    
                    <Card
                      mode="elevated"
                      style={{
                        borderRadius: tokens.radii.xl,
                        backgroundColor: theme.colors.surface,
                        elevation: 1,
                      }}
                    >
                      {/* Inner View wrapper to handle overflow for shadows */}
                      <View style={{ borderRadius: tokens.radii.xl, overflow: 'hidden' }}>
                        {groupedRooms[tower][level].map((room: any, idx: number) => {
                          const imageUrl = `https://endpoint.daythree.ai/faithMobile/room/${room.room_id}.jpeg`;
                          
                          return (
                            <View key={room.room_id}>
                              <Pressable
                                onPress={() => handleBookPress(room)}
                                style={({ pressed }) => ({
                                  flexDirection: "row",
                                  alignItems: "stretch", // Allow items to fill height
                                  backgroundColor: pressed ? theme.colors.surfaceVariant : 'transparent'
                                })}
                              >
                                <View style={{ flex: 1, gap: 2, padding: tokens.spacing.md, justifyContent: 'center' }}>
                                  <Text variant="bodyLarge" style={{ fontWeight: "600" }}>
                                    {room.Room_Name}
                                  </Text>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <MaterialCommunityIcons name="account-group-outline" size={14} color={theme.colors.onSurfaceVariant} />
                                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                      Up to {room.Capacity} Pax
                                    </Text>
                                  </View>
                                </View>
                                
                                <View 
                                  style={{ 
                                    width: 80, 
                                    height: 80, 
                                    backgroundColor: theme.colors.surfaceVariant,
                                  }}
                                >
                                  <Image
                                    source={{ uri: imageUrl }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                  />
                                </View>
                              </Pressable>
                              {idx !== groupedRooms[tower][level].length - 1 && (
                                <Divider style={{ marginHorizontal: tokens.spacing.md, opacity: 0.5 }} />
                              )}
                            </View>
                          );
                        })}
                      </View>
                    </Card>
                  </View>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}
