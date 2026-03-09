import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/header";
import MainCalendar from "../../../components/a/mainCalendar";
import MainDescription from "../../../components/a/mainDesc";
import { useAttendance } from "../../../hooks/useAttendance";
import ReminderCard from "../../../components/a/reminderCard";

export default function Main() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();
  const { selectedDate, selectDate, record, records } = useAttendance();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
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
