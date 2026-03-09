import React, { useRef, useState } from "react";
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useTheme, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import ScrollTop from "../../../components/scrollTop";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/a/header";
import MainCard from "../../../components/a/mainCard";
import SectionHeader from "../../../components/secHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import NewsFlashCarousel from "../../../components/a/newsflashCard";
import TwoRow from "../../../components/a/twoRow";

export default function Home() {
  const theme = useTheme();
  const tokens = useDesign();
  const router = useRouter();
  const { onScroll } = useTabs();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
    onScroll(offset);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          gap: tokens.spacing.md,
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"] * 2,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <MainCard />
        <SectionHeader
          icon={
            <MaterialCommunityIcons
              name="calendar-account-outline"
              size={26}
              color={theme.colors.primary}
            />
          }
          head="Leave Application"
          subHeader="Apply & track your leave status"
          rightSlot={
            <Button compact mode="text" onPress={() => router.push("/a/leave")}>
              View More
            </Button>
          }
        />

        <TwoRow
          left={{
            amount: 1,
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
            amount: 8,
            label: "Leave History",
            icon: (
              <MaterialCommunityIcons
                name="calendar-check-outline"
                size={20}
                color={theme.colors.onPrimaryContainer}
              />
            ),
            bgColor: theme.colors.primaryContainer,
            textColor: theme.colors.onPrimaryContainer,
            labelColor: theme.colors.onPrimaryContainer,
          }}
        />
        <SectionHeader
          icon={
            <MaterialCommunityIcons
              name="bullhorn-outline"
              size={26}
              color={theme.colors.primary}
            />
          }
          head="News Flash"
          subHeader="Latest announcements & updates"
          rightSlot={
            <Button
              compact
              mode="text"
              onPress={() => router.push("/a/newsflash")}
            >
              View All
            </Button>
          }
        />

        <NewsFlashCarousel />
        <SectionHeader
          icon={
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              size={26}
              color={theme.colors.primary}
            />
          }
          head="Room Booking"
          subHeader="Reserve & manage meeting rooms"
          rightSlot={
            <Button compact mode="text" onPress={() => router.push("/a/room")}>
              Check Now
            </Button>
          }
        />
        <TwoRow
          left={{
            amount: 2,
            label: "Active Booking",
            icon: (
              <MaterialCommunityIcons
                name="clock-check-outline"
                size={20}
                color={theme.colors.onPrimary}
              />
            ),
            bgColor: theme.colors.primary,
            textColor: theme.colors.onPrimary,
            labelColor: theme.colors.onPrimary,
          }}
          right={{
            amount: 12,
            label: "Booking History",
            icon: (
              <MaterialCommunityIcons
                name="history"
                size={20}
                color={theme.colors.onPrimaryContainer}
              />
            ),
            bgColor: theme.colors.primaryContainer,
            textColor: theme.colors.onPrimaryContainer,
            labelColor: theme.colors.onPrimaryContainer,
          }}
        />
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}
