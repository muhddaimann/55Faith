import React, { useEffect } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import { useHome } from "../../../hooks/useHome";
import Header from "../../../components/header";
import NewsflashTable from "../../../components/a/newsflashTable";
import NewsflashModalContent from "../../../components/a/newsflashModal";
import ScrollTop from "../../../components/scrollTop";
import { Broadcast } from "../../../contexts/api/broadcast";
import { useOverlay } from "../../../contexts/overlayContext";

export default function NewsflashPage() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();
  const { showModal, hideModal, toast } = useOverlay();

  const {
    broadcasts,
    criticalBroadcasts,
    importantBroadcasts,
    normalBroadcasts,
    loading,
    refreshHomeData,
    acknowledge
  } = useHome();

  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  useEffect(() => {
    setHideTabBar(true);
    return () => {
      setHideTabBar(false);
      hideModal();
    };
  }, []);

  const handleScroll = (e: any) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleAcknowledge = async (id: number) => {
    const res = await acknowledge(id);
    if (res.success) {
      toast({
        message: "Announcement acknowledged successfully",
        variant: "success"
      });
    } else {
      toast({
        message: res.message || "Failed to acknowledge announcement",
        variant: "error"
      });
    }
  };

  const handlePress = (broadcast: Broadcast) => {
    showModal({
      content: (
        <NewsflashModalContent
          broadcast={broadcast}
          onClose={hideModal}
          onAcknowledge={handleAcknowledge}
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
          title="News Flash"
          subtitle="Stay updated with latest announcements"
          showBack
        />

        <NewsflashTable
          broadcasts={broadcasts}
          critical={criticalBroadcasts}
          important={importantBroadcasts}
          normal={normalBroadcasts}
          onPress={handlePress}
        />
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}
