import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/header";
import ScrollTop from "../../../components/scrollTop";
import { useFocusEffect } from "expo-router";
import LeaveBody from "../../../components/a/leaveBody";

export default function LeavePage() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();

  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      return () => {
        setHideTabBar(false);
      };
    }, [setHideTabBar]),
  );

  const handleScroll = (e: any) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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
          gap: tokens.spacing.md,
        }}
      >
        <Header
          title="Leave Application"
          subtitle="Manage your leave requests"
          showBack
        />

        <LeaveBody />
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}
