import React, { useRef, useState } from "react";
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
  Pressable,
} from "react-native";
import { useTheme, Text, Card } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import ScrollTop from "../../../components/scrollTop";
import Header from "../../../components/b/header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHome } from "../../../hooks/useHome";

export default function Settings() {
  const theme = useTheme();
  const tokens = useDesign();
  const { onScroll } = useTabs();
  const { staff } = useHome();

  const scrollRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
    onScroll(offset);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          paddingBottom: tokens.spacing["3xl"] * 2,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.lg,
          }}
        >
          <Card
            mode="elevated"
            style={{
              borderRadius: tokens.radii.xl,
              backgroundColor: theme.colors.surface,
            }}
            contentStyle={{
              padding: tokens.spacing.lg,
              gap: tokens.spacing.md,
            }}
          >
            <Text variant="titleSmall" style={{ fontWeight: "600" }}>
              Staff Information
            </Text>

            <View style={{ gap: tokens.spacing.xs }}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Name
              </Text>
              <Text variant="bodyMedium">{staff?.full_name || "---"}</Text>
            </View>

            <View style={{ gap: tokens.spacing.xs }}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Email
              </Text>
              <Text variant="bodyMedium">{staff?.email || "---"}</Text>
            </View>

            <View style={{ gap: tokens.spacing.xs }}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Contact Number
              </Text>
              <Text variant="bodyMedium">{staff?.contact_no || "---"}</Text>
            </View>

            <View style={{ gap: tokens.spacing.xs }}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Address
              </Text>
              <Text variant="bodyMedium">{staff?.full_address || "---"}</Text>
            </View>
          </Card>

          <Card
            mode="elevated"
            style={{
              borderRadius: tokens.radii.xl,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Pressable
              style={{
                paddingHorizontal: tokens.spacing.lg,
                paddingVertical: tokens.spacing.md,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: tokens.spacing.md,
                }}
              >
                <MaterialCommunityIcons
                  name="information-outline"
                  size={22}
                  color={theme.colors.primary}
                />
                <Text variant="bodyMedium">App Version</Text>
              </View>

              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                v1.0.0
              </Text>
            </Pressable>
          </Card>
        </View>
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </>
  );
}
