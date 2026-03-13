import React, { useEffect, useCallback } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import { useLoader } from "../../../contexts/loaderContext";
import Header from "../../../components/header";
import MainCalendar from "../../../components/a/mainCalendar";
import MainDescription from "../../../components/a/mainDesc";
import { useAttendance } from "../../../hooks/useAttendance";
import ReminderCard from "../../../components/a/reminderCard";

export default function Main() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();
  const { showLoader, hideLoader } = useLoader();
  const { selectedDate, selectDate, record, records, loading, refresh } = useAttendance();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  useEffect(() => {
    if (loading && Object.keys(records).length === 0) {
      showLoader("Loading attendance records...");
    } else {
      hideLoader();
    }
  }, [loading, records, showLoader, hideLoader]);

  const onRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"],
          gap: tokens.spacing.lg,
        }}
      >
        <Header
          title="Attendance"
          subtitle="Track your shift & working status"
          showBack
        />

        <MainCalendar
          selectedDate={selectedDate}
          records={records}
          onSelect={selectDate}
        />

        <MainDescription record={record} />
        <ReminderCard />
      </ScrollView>
    </View>
  );
}
