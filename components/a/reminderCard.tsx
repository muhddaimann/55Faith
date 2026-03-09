import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../../contexts/designContext";

type ReminderType = "ph_work" | "missing_checkout" | "late";

export default function ReminderCard() {
  const { colors } = useTheme();
  const tokens = useDesign();

  const [index, setIndex] = useState(0);

  const reminders: {
    type: ReminderType;
    icon: string;
    title: string;
    message: string;
  }[] = [
    {
      type: "ph_work",
      icon: "calendar-alert",
      title: "Public Holiday Work",
      message:
        "You worked on a public holiday. You may be eligible to claim PH allowance.",
    },
    {
      type: "late",
      icon: "timer-sand",
      title: "Late Attendance",
      message: "Your clock-in time was later than scheduled.",
    },
  ];

  const current = reminders[index];

  const next = () => {
    setIndex((i) => (i + 1) % reminders.length);
  };

  return (
    <View style={{ gap: tokens.spacing.sm }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          variant="titleMedium"
          style={{
            fontWeight: "700",
            color: colors.onSurface,
          }}
        >
          Reminder
        </Text>

        <Text
          variant="bodySmall"
          style={{
            color: colors.onSurfaceVariant,
            fontWeight: "600",
          }}
        >
          {index + 1}/{reminders.length}
        </Text>
      </View>

      <Card
        mode="elevated"
        style={{
          borderRadius: tokens.radii.xl,
          backgroundColor: colors.surface,
        }}
        contentStyle={{
          padding: tokens.spacing.lg,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: tokens.spacing.md,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: tokens.radii.lg,
              backgroundColor: colors.primaryContainer,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name={current.icon as any}
              size={22}
              color={colors.onPrimaryContainer}
            />
          </View>

          <View style={{ flex: 1, gap: 4 }}>
            <Text
              variant="titleSmall"
              style={{
                fontWeight: "600",
                color: colors.onSurface,
              }}
            >
              {current.title}
            </Text>

            <Text
              variant="bodyMedium"
              style={{
                color: colors.onSurfaceVariant,
                lineHeight: 20,
              }}
            >
              {current.message}
            </Text>
          </View>

          <Pressable
            onPress={next}
            style={({ pressed }) => ({
              width: 34,
              height: 34,
              borderRadius: tokens.radii.full,
              backgroundColor: colors.surfaceVariant,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={colors.onSurfaceVariant}
            />
          </Pressable>
        </View>
      </Card>
    </View>
  );
}
