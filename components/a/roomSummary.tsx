import React from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../../contexts/designContext";

type RoomSummaryProps = {
  selectedDate: string;
  activeBookingsCount: number;
  onDatePress: () => void;
  onHistoryPress: () => void;
};

export default function RoomSummary({
  selectedDate,
  activeBookingsCount,
  onDatePress,
  onHistoryPress,
}: RoomSummaryProps) {
  const theme = useTheme();
  const tokens = useDesign();

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <View
        style={{
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: tokens.radii.xl,
          paddingHorizontal: tokens.spacing.lg,
          paddingVertical: tokens.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={22}
            color={theme.colors.onPrimaryContainer}
          />
          <Text
            variant="labelLarge"
            style={{ color: theme.colors.onPrimaryContainer }}
          >
            Active Booking
          </Text>
        </View>

        <Text
          variant="headlineMedium"
          style={{
            fontWeight: "700",
            color: theme.colors.onPrimaryContainer,
          }}
        >
          {activeBookingsCount}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
        <Pressable
          onPress={onDatePress}
          style={({ pressed }) => ({
            flex: 4,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: tokens.radii.lg,
            paddingHorizontal: tokens.spacing.lg,
            paddingVertical: tokens.spacing.md,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <MaterialCommunityIcons
            name="calendar-outline"
            size={20}
            color={theme.colors.primary}
            style={{ marginRight: tokens.spacing.sm }}
          />

          <View style={{ flex: 1 }}>
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Showing Availability For
            </Text>
            <Text variant="titleMedium" style={{ fontWeight: "700" }}>
              {formattedDate}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onHistoryPress}
          style={({ pressed }) => ({
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: tokens.radii.lg,
            paddingHorizontal: tokens.spacing.md,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            variant="labelLarge"
            style={{
              fontWeight: "700",
              color: theme.colors.primary,
            }}
          >
            History
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
