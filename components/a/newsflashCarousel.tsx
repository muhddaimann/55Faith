import React from "react";
import { ScrollView, View, Dimensions } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useBroadcastStore } from "../../contexts/api/broadcastStore";

const { width } = Dimensions.get("window");

export default function NewsFlashCarousel() {
  const { colors } = useTheme();
  const tokens = useDesign();
  const { broadcasts } = useBroadcastStore();

  if (broadcasts.length === 0) {
    return (
      <View style={{ padding: tokens.spacing.lg, alignItems: 'center' }}>
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          No announcements at the moment.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.xs,
        }}
      >
        {broadcasts.map((item, index) => (
          <View
            key={item.ID}
            style={{
              width: width * 0.75,
              marginRight: index !== broadcasts.length - 1 ? tokens.spacing.md : 0,
            }}
          >
            <Card
              mode="elevated"
              style={{
                borderRadius: tokens.radii.xl,
                backgroundColor: colors.surface,
              }}
              contentStyle={{
                padding: tokens.spacing.lg,
                gap: tokens.spacing.md,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: tokens.radii.full,
                  backgroundColor: colors.primaryContainer,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name={item.BroadcastPriority === "High" ? "alert-circle" : "bullhorn-outline"}
                  size={20}
                  color={colors.primary}
                />
              </View>

              <View style={{ gap: tokens.spacing.xs }}>
                <Text variant="titleMedium" style={{ fontWeight: "600" }} numberOfLines={1}>
                  {item.NewsName}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: colors.onSurfaceVariant }}
                  numberOfLines={2}
                >
                  {item.Description}
                </Text>
              </View>
            </Card>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
