import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Text, Card, useTheme, Divider, Chip } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/header";
import TwoRow from "../../../components/a/twoRow";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Leave() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, []);

  const today = new Date().toLocaleDateString("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const leaves = [
    {
      type: "Annual Leave",
      date: "21 Mar 2026",
      days: "2 Days",
      status: "Pending",
    },
    {
      type: "Medical Leave",
      date: "10 Mar 2026",
      days: "1 Day",
      status: "Approved",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"],
          gap: tokens.spacing.lg,
        }}
      >
        <Header
          title="Leave Application"
          subtitle="Manage your leave requests"
          showBack
        />

        <TwoRow
          left={{
            amount: 1,
            label: "Pending Leave",
            icon: (
              <MaterialCommunityIcons
                name="timer-sand"
                size={20}
                color={theme.colors.primary}
              />
            ),
            bgColor: theme.colors.primaryContainer,
            textColor: theme.colors.onPrimaryContainer,
            labelColor: theme.colors.onPrimaryContainer,
          }}
          right={{
            amount: 12,
            label: "Leave Balance",
            icon: (
              <MaterialCommunityIcons
                name="calendar-check-outline"
                size={20}
                color={theme.colors.secondary}
              />
            ),
            bgColor: theme.colors.secondaryContainer,
            textColor: theme.colors.onSecondaryContainer,
            labelColor: theme.colors.onSecondaryContainer,
          }}
        />

        <View style={{ gap: tokens.spacing.md }}>
          <Text variant="titleMedium" style={{ fontWeight: "600" }}>
            Recent Applications
          </Text>

          <Card
            mode="elevated"
            style={{
              borderRadius: tokens.radii.xl,
              backgroundColor: theme.colors.surface,
            }}
            contentStyle={{
              padding: tokens.spacing.md,
              gap: tokens.spacing.sm,
            }}
          >
            {leaves.map((leave, index) => (
              <View key={index}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: tokens.spacing.xs,
                  }}
                >
                  <View style={{ gap: 2 }}>
                    <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                      {leave.type}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      {leave.date} · {leave.days}
                    </Text>
                  </View>

                  <Chip
                    compact
                    style={{
                      backgroundColor:
                        leave.status === "Approved"
                          ? theme.colors.secondaryContainer
                          : theme.colors.primaryContainer,
                    }}
                    textStyle={{
                      color:
                        leave.status === "Approved"
                          ? theme.colors.onSecondaryContainer
                          : theme.colors.onPrimaryContainer,
                    }}
                  >
                    {leave.status}
                  </Chip>
                </View>

                {index !== leaves.length - 1 && <Divider />}
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
