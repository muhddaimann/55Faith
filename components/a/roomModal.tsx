import React, { useEffect, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import {
  Text,
  useTheme,
  Divider,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Room } from "../../contexts/api/room";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NoData from "../noData";
import useRoom from "../../hooks/useHome";

type Props = {
  room: Room;
  date: string;
  onConfirm: (startTime: string, endTime: string) => void;
  onClose: () => void;
};

export default function RoomModalContent({
  room,
  date,
  onConfirm,
  onClose,
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();

  const {
    roomsLoading,
    availabilityLoading,
    fetchAvailability,
    getTimeSlotRows,
    roomDetails,
    formattedDate,
    error,
    selection,
    onSelectSlot,
    isSlotSelected,
    viewedBookingPurpose,
  } = useRoom(date);

  const key = `${room.room_id}_${date}`;

  useEffect(() => {
    fetchAvailability(room.room_id);
  }, [room.room_id, fetchAvailability]);

  const details = roomDetails[key];
  const timeSlotRows = useMemo(
    () => getTimeSlotRows(room.room_id),
    [getTimeSlotRows, room.room_id],
  );

  const isActuallyLoading = roomsLoading || availabilityLoading[key];
  const hasData = timeSlotRows.length > 0;
  const showFullLoader = isActuallyLoading && !hasData;

  const confirmLabel = useMemo(() => {
    if (viewedBookingPurpose) return viewedBookingPurpose;
    if (!selection) return "Select time slot";
    if (selection.startTime === selection.endTime) {
      return `Confirm ${selection.startTime}`;
    }
    return `Confirm ${selection.startTime} - ${selection.endTime}`;
  }, [selection, viewedBookingPurpose]);

  return (
    <View style={{ gap: tokens.spacing.sm }}>
      <View style={{ gap: tokens.spacing.xxs }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            variant="titleLarge"
            style={{ fontWeight: tokens.typography.weights.bold, flex: 1 }}
          >
            {room.Room_Name}
          </Text>
          {isActuallyLoading && hasData && (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          )}
        </View>

        {details && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.sm,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: tokens.spacing.xxs,
              }}
            >
              <MaterialCommunityIcons
                name="office-building"
                size={tokens.sizes.icon.sm}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {details.Tower} · {details.Level}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: tokens.spacing.xxs,
              }}
            >
              <MaterialCommunityIcons
                name="account-group"
                size={tokens.sizes.icon.sm}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Capacity {details.Capacity}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: tokens.spacing.xxs,
              }}
            >
              <MaterialCommunityIcons
                name="calendar"
                size={tokens.sizes.icon.sm}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {formattedDate}
              </Text>
            </View>
          </View>
        )}
      </View>

      <Divider style={{ marginVertical: tokens.spacing.xxs }} />

      {showFullLoader ? (
        <View
          style={{
            padding: tokens.spacing["2xl"],
            alignItems: "center",
            gap: tokens.spacing.sm,
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyMedium">Checking availability...</Text>
        </View>
      ) : error ? (
        <NoData title="Error" message={error} icon="alert-circle" />
      ) : timeSlotRows.length === 0 ? (
        <NoData
          title="No Slots"
          message="No available slots for the remainder of today."
          icon="calendar-remove-outline"
        />
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: tokens.spacing.xxs,
            }}
          >
            <Text
              variant="labelMedium"
              style={{ fontWeight: tokens.typography.weights.semibold }}
            >
              Room Availability
            </Text>

            <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: tokens.spacing.xxs,
                }}
              >
                <View
                  style={{
                    width: tokens.spacing.xs,
                    height: tokens.spacing.xs,
                    borderRadius: tokens.radii.full,
                    backgroundColor: theme.colors.tertiaryContainer,
                  }}
                />
                <Text
                  variant="labelSmall"
                  style={{
                    fontSize: tokens.typography.sizes.xs,
                    opacity: tokens.typography.opacities.muted,
                  }}
                >
                  Available
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: tokens.spacing.xxs,
                }}
              >
                <View
                  style={{
                    width: tokens.spacing.xs,
                    height: tokens.spacing.xs,
                    borderRadius: tokens.radii.full,
                    backgroundColor: theme.colors.surfaceVariant,
                  }}
                />
                <Text
                  variant="labelSmall"
                  style={{
                    fontSize: tokens.typography.sizes.xs,
                    opacity: tokens.typography.opacities.muted,
                  }}
                >
                  Booked
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 320 }}
          >
            <View style={{ gap: tokens.spacing.sm }}>
              {timeSlotRows.map((row, rIdx) => (
                <View
                  key={rIdx}
                  style={{ flexDirection: "row", gap: tokens.spacing.sm }}
                >
                  {row.map((slot) => {
                    const { time, status } = slot;
                    const available = status === "Available";
                    const selected = isSlotSelected(room.room_id, time);

                    return (
                      <Pressable
                        key={time}
                        onPress={() => onSelectSlot(room.room_id, time, slot)}
                        style={{
                          flex: 1,
                          paddingVertical: tokens.spacing.md,
                          borderRadius: tokens.radii.lg,
                          alignItems: "center",
                          backgroundColor: selected
                            ? theme.colors.primary
                            : available
                              ? theme.colors.tertiaryContainer
                              : theme.colors.surfaceVariant,
                        }}
                      >
                        <Text
                          variant="bodyMedium"
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                            fontWeight: tokens.typography.weights.bold,
                            fontSize: tokens.typography.sizes.xs,
                            color: selected
                              ? theme.colors.onPrimary
                              : available
                                ? theme.colors.onTertiaryContainer
                                : theme.colors.onSurfaceVariant,
                          }}
                        >
                          {time}
                        </Text>
                      </Pressable>
                    );
                  })}
                  {row.length === 1 && <View style={{ flex: 1 }} />}
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={{ marginTop: tokens.spacing.xs }}>
            <Button
              mode="contained"
              disabled={!selection || !!viewedBookingPurpose}
              onPress={() =>
                onConfirm(selection!.startTime, selection!.endTime)
              }
              style={{ borderRadius: tokens.radii.lg }}
              contentStyle={{ height: tokens.sizes.touch.minHeight }}
              labelStyle={{
                fontSize: tokens.typography.sizes.sm,
                fontWeight: tokens.typography.weights.bold,
              }}
            >
              {confirmLabel}
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
