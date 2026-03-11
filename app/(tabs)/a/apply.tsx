import React, { useState, useCallback, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text, TextInput, Button, Card, useTheme } from "react-native-paper";
import { useRouter, useFocusEffect } from "expo-router";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import useLeave from "../../../hooks/useLeave";
import { useOverlay } from "../../../contexts/overlayContext";
import { useLoader } from "../../../contexts/loaderContext";
import Header from "../../../components/header";
import ScrollTop from "../../../components/scrollTop";
import PickerModal, { PickerItem } from "../../../components/pickerModal";
import DatePicker from "../../../components/dateModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LeaveApply() {
  const theme = useTheme();
  const tokens = useDesign();
  const router = useRouter();
  const { setHideTabBar } = useTabs();
  const { showModal, hideModal, toast } = useOverlay();
  const { showLoader, hideLoader } = useLoader();
  
  const { 
    leave, 
    options, 
    submitLeaveRequest, 
    submitting 
  } = useLeave();
  
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Form State
  const [leaveType, setLeaveType] = useState(options.leaveTypes[0]);
  const [period, setPeriod] = useState(options.leavePeriods[0]);
  const [reason, setReason] = useState(options.leaveReasons[0]);
  const [dateRange, setDateRange] = useState({ 
    start: new Date().toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });
  const [remarks, setRemarks] = useState("");

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      return () => {
        setHideTabBar(false);
        hideModal();
      };
    }, []),
  );

  const handleScroll = (e: any) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handlePickerPress = (title: string, current: any, items: any[], setter: (v: any) => void) => {
    const pickerItems: PickerItem[] = items.map(item => ({
      label: item.label,
      onPress: () => setter(item)
    }));
    showModal({
      content: <PickerModal title={title} items={pickerItems} onClose={hideModal} />,
    });
  };

  const handleDatePress = () => {
    showModal({
      content: (
        <DatePicker
          mode={period.value === "Full Day" ? "RANGE" : "SINGLE"}
          initialDate={dateRange.start}
          initialRange={dateRange}
          onConfirm={(val) => {
            if (typeof val === 'string') {
              setDateRange({ start: val, end: val });
            } else {
              setDateRange(val);
            }
            hideModal();
          }}
        />
      ),
    });
  };

  const handleSubmit = async () => {
    showLoader("Submitting application...");
    try {
      const res = await submitLeaveRequest({
        leaveType: leaveType.value,
        period: period.value,
        range: dateRange,
        reasonType: reason.value,
        remarks: remarks,
      });

      if (res.success) {
        toast({ message: "Application submitted successfully", variant: "success" });
        router.back();
      } else {
        toast({ message: res.error || "Failed to submit application", variant: "error" });
      }
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"],
          gap: tokens.spacing.lg,
        }}
      >
        <Header title="Apply Leave" subtitle="Submit a new request" showBack />

        <Card
          mode="elevated"
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: tokens.radii.xl,
            elevation: 2,
          }}
        >
          <View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}>
            <View style={{ marginBottom: tokens.spacing.xs }}>
              <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                Leave Details
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Current Balance: {leave.annualLeaveLeft} Days
              </Text>
            </View>

            {/* Leave Type */}
            <Pressable onPress={() => handlePickerPress("Select Leave Type", leaveType, options.leaveTypes, setLeaveType)}>
              <TextInput
                label="Leave Type"
                mode="outlined"
                value={leaveType.label}
                editable={false}
                pointerEvents="none"
                left={<TextInput.Icon icon="calendar-outline" />}
                right={<TextInput.Icon icon="chevron-down" />}
              />
            </Pressable>

            {/* Period */}
            <Pressable onPress={() => handlePickerPress("Select Period", period, options.leavePeriods, setPeriod)}>
              <TextInput
                label="Leave Period"
                mode="outlined"
                value={period.label}
                editable={false}
                pointerEvents="none"
                left={<TextInput.Icon icon="clock-outline" />}
                right={<TextInput.Icon icon="chevron-down" />}
              />
            </Pressable>

            {/* Dates */}
            <Pressable onPress={handleDatePress}>
              <TextInput
                label={period.value === "Full Day" ? "Date Range" : "Date"}
                mode="outlined"
                value={period.value === "Full Day" 
                  ? `${dateRange.start} to ${dateRange.end}` 
                  : dateRange.start}
                editable={false}
                pointerEvents="none"
                left={<TextInput.Icon icon="calendar-range" />}
                right={<TextInput.Icon icon="chevron-down" />}
              />
            </Pressable>

            {/* Reason Category */}
            <Pressable onPress={() => handlePickerPress("Select Reason", reason, options.leaveReasons, setReason)}>
              <TextInput
                label="Reason Category"
                mode="outlined"
                value={reason.label}
                editable={false}
                pointerEvents="none"
                left={<TextInput.Icon icon="tag-outline" />}
                right={<TextInput.Icon icon="chevron-down" />}
              />
            </Pressable>

            {/* Remarks */}
            <TextInput
              label="Remarks / Description"
              mode="outlined"
              value={remarks}
              onChangeText={setRemarks}
              multiline
              numberOfLines={4}
              placeholder="Provide more details..."
              left={<TextInput.Icon icon="text-box-outline" />}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              style={{
                borderRadius: tokens.radii.lg,
                marginTop: tokens.spacing.sm,
              }}
              contentStyle={{ height: 48 }}
            >
              Submit Application
            </Button>
          </View>
        </Card>
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}
