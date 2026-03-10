import React from "react";
import { View } from "react-native";
import { Text, Card, Chip, useTheme, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../../contexts/designContext";
import { BookingItem } from "../../contexts/api/room";

type Props = {
  booking: BookingItem;
  onPress: (booking: BookingItem) => void;
};

export default function BookingCard({ booking, onPress }: Props) {
  const theme = useTheme();
  const tokens = useDesign();

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          bg: theme.colors.tertiaryContainer,
          text: theme.colors.onTertiaryContainer,
        };
      case "cancelled":
        return {
          bg: theme.colors.errorContainer,
          text: theme.colors.onErrorContainer,
        };
      case "pending":
        return {
          bg: theme.colors.primaryContainer,
          text: theme.colors.onPrimaryContainer,
        };
      default:
        return {
          bg: theme.colors.surfaceVariant,
          text: theme.colors.onSurfaceVariant,
        };
    }
  };

  const formatDateTime = (startStr: string, endStr: string) => {
    try {
      const start = new Date(startStr.replace(" ", "T"));
      const end = new Date(endStr.replace(" ", "T"));
      
      const datePart = start.toLocaleDateString("en-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      
      const startTime = start.toLocaleTimeString("en-MY", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      
      const endTime = end.toLocaleTimeString("en-MY", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return `${datePart} · ${startTime} - ${endTime}`;
    } catch (e) {
      return `${startStr} - ${endStr}`;
    }
  };

  const statusStyle = getStatusStyle(booking.Status);

  return (
    <Card
      mode="elevated"
      onPress={() => onPress(booking)}
      style={{
        marginBottom: tokens.spacing.md,
        borderRadius: tokens.radii.lg,
        backgroundColor: theme.colors.surface,
      }}
    >
      <View style={{ padding: tokens.spacing.md }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: tokens.spacing.sm,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: tokens.spacing.md, flex: 1 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: theme.colors.surfaceVariant,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="door-open"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ fontWeight: "700" }} numberOfLines={1}>
                {booking.Room_Name}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {booking.Tower} · {booking.Level}
              </Text>
            </View>
          </View>
          <Chip
            compact
            style={{ backgroundColor: statusStyle.bg }}
            textStyle={{ color: statusStyle.text, fontSize: 10 }}
          >
            {booking.Status}
          </Chip>
        </View>

        <Divider style={{ marginBottom: tokens.spacing.sm, opacity: 0.5 }} />

        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialCommunityIcons name="calendar-clock" size={14} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {formatDateTime(booking.Start_Date, booking.End_Date)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialCommunityIcons name="text-box-outline" size={14} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }} numberOfLines={1}>
              {booking.Event_Name}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
