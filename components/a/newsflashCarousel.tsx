import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useBroadcastStore } from "../../contexts/api/broadcastStore";
import NewsflashCard from "./newsflashCard";
import { useOverlay } from "../../contexts/overlayContext";
import NewsflashModalContent from "./newsflashModal";
import { Broadcast } from "../../contexts/api/broadcast";

const { width } = Dimensions.get("window");

export default function NewsFlashCarousel() {
  const { colors } = useTheme();
  const tokens = useDesign();
  const { broadcasts, markAcknowledged } = useBroadcastStore();
  const { showModal, hideModal } = useOverlay();

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const latestThree = useMemo(() => {
    return [...broadcasts]
      .sort(
        (a, b) =>
          new Date(b.CreatedDateTime.replace(" ", "T")).getTime() -
          new Date(a.CreatedDateTime.replace(" ", "T")).getTime(),
      )
      .slice(0, 3);
  }, [broadcasts]);

  // Auto-loop effect
  useEffect(() => {
    if (latestThree.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % latestThree.length;
      setActiveIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (width * 0.85 + tokens.spacing.md),
        animated: true,
      });
    }, 5000); // 5 seconds loop

    return () => clearInterval(timer);
  }, [activeIndex, latestThree.length, tokens.spacing.md]);

  if (latestThree.length === 0) {
    return null;
  }

  const handlePress = (broadcast: Broadcast) => {
    showModal({
      content: (
        <NewsflashModalContent
          broadcast={broadcast}
          onClose={hideModal}
          onAcknowledge={markAcknowledged}
        />
      ),
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(
      scrollPosition / (width * 0.85 + tokens.spacing.md),
    );
    if (index !== activeIndex && index >= 0 && index < latestThree.length) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={width * 0.85 + tokens.spacing.md}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.xs,
          alignItems: "center",
        }}
      >
        {latestThree.map((item, index) => (
          <View
            key={item.ID}
            style={{
              width: width * 0.85,
              marginRight:
                index !== latestThree.length - 1 ? tokens.spacing.md : 0,
            }}
          >
            <NewsflashCard broadcast={item} onPress={handlePress} />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Indicators */}
      {latestThree.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
          }}
        >
          {latestThree.map((_, index) => (
            <View
              key={index}
              style={{
                width: activeIndex === index ? 16 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor:
                  activeIndex === index
                    ? colors.primary
                    : colors.surfaceVariant,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
