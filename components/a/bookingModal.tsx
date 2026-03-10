import React from "react";
import { View, ScrollView } from "react-native";
import { Text, Button, Divider, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { BookingItem } from "../../contexts/api/room";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  booking: BookingItem;
  onWithdraw?: (booking: BookingItem) => void;
};

export default function BookingModalContent({
  booking,
  onWithdraw,
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();

  const isUpcoming = booking.Tag === "Upcoming" && booking.Status !== "Cancelled";

  const DetailItem = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value: string;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: tokens.spacing.md,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: tokens.radii.md,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surfaceVariant,
        }}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color={theme.colors.primary}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          variant="labelSmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {label}
        </Text>
        <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
          {value}
        </Text>
      </View>
    </View>
  );

  const formatDateTime = (startStr: string, endStr: string) => {
    try {
      const start = new Date(startStr.replace(" ", "T"));
      const end = new Date(endStr.replace(" ", "T"));
      return `${start.toLocaleDateString("en-MY", { day: 'numeric', month: 'short', year: 'numeric' })} · ${start.toLocaleTimeString("en-MY", { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString("en-MY", { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
      return `${startStr} - ${endStr}`;
    }
  };

  return (
    <View style={{ gap: tokens.spacing.lg }}>
      <View>
        <Text variant="headlineSmall" style={{ fontWeight: "700" }}>
          Booking Details
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Booking Number: {booking.Booking_Num}
        </Text>
      </View>

      <Divider />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 400 }}
      >
        <View style={{ gap: tokens.spacing.lg }}>
          <DetailItem
            icon="door-open"
            label="Room"
            value={booking.Room_Name}
          />

          <DetailItem
            icon="office-building-outline"
            label="Location"
            value={`${booking.Tower}, ${booking.Level}`}
          />

          <DetailItem
            icon="calendar-clock"
            label="Date & Time"
            value={formatDateTime(booking.Start_Date, booking.End_Date)}
          />

          <DetailItem
            icon="text-box-outline"
            label="Purpose / Event"
            value={booking.Event_Name}
          />

          <DetailItem
            icon="account-outline"
            label="PIC"
            value={booking.PIC}
          />

          <DetailItem
            icon="check-decagram-outline"
            label="Status"
            value={booking.Status}
          />
        </View>
      </ScrollView>

      {isUpcoming && onWithdraw && (
        <Button
          mode="outlined"
          onPress={() => onWithdraw(booking)}
          style={{ borderColor: theme.colors.error }}
          textColor={theme.colors.error}
          icon="close-circle-outline"
        >
          Cancel Booking
        </Button>
      )}
    </View>
  );
}
