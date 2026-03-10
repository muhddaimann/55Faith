import React, { useState, useCallback, useMemo } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
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
  const pic = staff?.full_name || "";

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      return () => setHideTabBar(false);
    }, []),
  );

  const isDisabled = useMemo(() => {
    return !purpose.trim();
  }, [purpose]);

  const handleFinalizeBooking = async () => {
    if (isDisabled) return;

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
      );

      if ("error" in res) {
        toast({
          message: res.error || "Failed to book room",
          variant: "error",
        });
      } else {
        toast({ message: "Room booked successfully!", variant: "success" });
        await refreshHomeData();
        router.replace("/(tabs)/a");
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"],
          gap: tokens.spacing.md,
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
          }}
        >
          <View
            style={{
              padding: tokens.spacing.lg,
              gap: tokens.spacing.lg,
            }}
          >
            <View style={{ gap: tokens.spacing.xxs }}>
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: tokens.typography.weights.bold,
                  color: theme.colors.primary,
                }}
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
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: tokens.spacing.sm,
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={tokens.sizes.icon.md}
                  color={theme.colors.primary}
                />
                <Text variant="bodyMedium">
                  {formatDate(params.date as string)}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: tokens.spacing.sm,
                }}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={tokens.sizes.icon.md}
                  color={theme.colors.primary}
                />
                <Text
                  variant="bodyMedium"
                  style={{ fontWeight: tokens.typography.weights.semibold }}
                >
                  {params.start_time} - {params.end_time}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={{ gap: tokens.spacing.md }}>
          <View style={{ gap: tokens.spacing.sm }}>
            <Text
              variant="labelMedium"
              style={{ fontWeight: tokens.typography.weights.semibold }}
            >
              Person In Charge
            </Text>

            <TextInput
              mode="outlined"
              value={pic}
              disabled
              outlineStyle={{ borderRadius: tokens.radii.lg }}
            />
          </View>

          <View style={{ gap: tokens.spacing.sm }}>
            <Text
              variant="labelMedium"
              style={{ fontWeight: tokens.typography.weights.semibold }}
            >
              Meeting Purpose
            </Text>

            <TextInput
              mode="outlined"
              placeholder="e.g. Project Kickoff Meeting"
              value={purpose}
              onChangeText={setPurpose}
              outlineStyle={{ borderRadius: tokens.radii.lg }}
            />
          </View>

          <Button
            mode="contained"
            disabled={isDisabled}
            onPress={handleFinalizeBooking}
            style={{
              marginTop: tokens.spacing.sm,
              borderRadius: tokens.radii.lg,
            }}
            contentStyle={{
              height: tokens.sizes.touch.minHeight,
            }}
            labelStyle={{
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.bold,
            }}
          >
            Confirm & Book
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
