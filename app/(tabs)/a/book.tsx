import React, { useState, useCallback } from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  Divider,
} from "react-native-paper";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHome } from "../../../hooks/useHome";
import { useOverlay } from "../../../contexts/overlayContext";
import { useLoader } from "../../../contexts/loaderContext";

export default function BookPage() {
  const theme = useTheme();
  const tokens = useDesign();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setHideTabBar } = useTabs();
  const { toast } = useOverlay();
  const { showLoader, hideLoader } = useLoader();
  const { createBooking, staff, refreshHomeData } = useHome();

  const [purpose, setPurpose] = useState("");
  const [pic, setPic] = useState(staff?.full_name || "");

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      return () => setHideTabBar(false);
    }, []),
  );

  const handleFinalizeBooking = async () => {
    if (!purpose.trim()) {
      toast({ message: "Please enter meeting purpose", variant: "error" });
      return;
    }

    showLoader("Processing booking...");
    try {
      const res = await createBooking(
        params.date as string,
        params.start_time as string,
        params.end_time as string,
        params.room_name as string,
        params.tower as string,
        params.level as string,
        purpose,
        pic,
        "",
        Number(params.room_id),
      );

      if ("error" in res) {
        toast({
          message: res.error || "Failed to book room",
          variant: "error",
        });
      } else {
        toast({ message: "Room booked successfully!", variant: "success" });
        await refreshHomeData();
        router.replace("/a/history");
      }
    } finally {
      hideLoader();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-MY", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
          title="Finalize Booking"
          subtitle="Complete your reservation details"
          showBack
        />

        <Card
          mode="elevated"
          style={{
            borderRadius: tokens.radii.xl,
            backgroundColor: theme.colors.surface,
            elevation: 2,
          }}
        >
          <View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}>
            <View style={{ gap: 4 }}>
              <Text
                variant="titleMedium"
                style={{ fontWeight: "700", color: theme.colors.primary }}
              >
                {params.room_name}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {params.tower} · {params.level}
              </Text>
            </View>

            <Divider />

            <View style={{ gap: tokens.spacing.sm }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text variant="bodyMedium">
                  {formatDate(params.date as string)}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                  {params.start_time} - {params.end_time}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={{ gap: tokens.spacing.md }}>
          <TextInput
            label="Person In Charge (PIC)"
            mode="outlined"
            value={pic}
            onChangeText={setPic}
            outlineStyle={{ borderRadius: tokens.radii.lg }}
          />
          <TextInput
            label="Meeting Purpose / Event Name"
            mode="outlined"
            placeholder="e.g. Project Kickoff Meeting"
            value={purpose}
            onChangeText={setPurpose}
            outlineStyle={{ borderRadius: tokens.radii.lg }}
          />

          <Button
            mode="contained"
            onPress={handleFinalizeBooking}
            style={{
              marginTop: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
            }}
            contentStyle={{ height: 52 }}
            labelStyle={{ fontSize: 16, fontWeight: "700" }}
          >
            Confirm & Book
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
