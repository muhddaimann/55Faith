import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  View,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, TextInput, Button, Card, useTheme } from "react-native-paper";
import { useRouter, useFocusEffect } from "expo-router";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import { useOverlay } from "../../../contexts/overlayContext";
import { useLoader } from "../../../contexts/loaderContext";
import Header from "../../../components/header";
import ScrollTop from "../../../components/scrollTop";
import PickerModal, { PickerItem } from "../../../components/pickerModal";
import DatePicker from "../../../components/dateModal";
import DocumentPicker from "../../../components/documentPicker";
import ClinicPicker from "../../../components/clinicPicker";
import { Clinic } from "../../../contexts/api/clinic";
import useLeave from "../../../hooks/useLeave";
import { buildDateRangeLabel } from "../../../constants/leave";

export default function LeaveApply() {
  const theme = useTheme();
  const tokens = useDesign();
  const router = useRouter();
  const { setHideTabBar } = useTabs();
  const { showModal, hideModal, toast } = useOverlay();
  const { showLoader, hideLoader } = useLoader();

  const { options, helpers, submitLeaveRequest, submitting: isSubmitting } = useLeave();

  const [leaveType, setLeaveType] = useState<any>(null);
  const [period, setPeriod] = useState<any>(null);
  const [reason, setReason] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [remarks, setRemarks] = useState("");
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [illness, setIllness] = useState("");
  const [attachment, setAttachment] = useState<any>(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentRef, setAttachmentRef] = useState("");

  const isMedical = leaveType?.isMedical;
  const requiresAttachment = leaveType?.requiresAttachment;
  const isFullDay = period?.value === "Full Day";

  const duration = useMemo(() => {
    if (!period || !dateRange.start) return 0;
    if (isFullDay) {
      if (!dateRange.end) return 0;
      return helpers.diffDays(dateRange.start, dateRange.end);
    }
    return 0.5;
  }, [period, dateRange, isFullDay, helpers]);

  const isValid = useMemo(() => {
    const basic =
      !!leaveType &&
      !!period &&
      !!dateRange.start &&
      (isFullDay ? !!dateRange.end : true) &&
      !!reason;
    const medical = isMedical ? !!illness : true;
    const attach = requiresAttachment ? !!attachment : true;
    return basic && medical && attach && duration > 0;
  }, [
    leaveType,
    period,
    dateRange,
    reason,
    isMedical,
    illness,
    requiresAttachment,
    attachment,
    duration,
    isFullDay,
  ]);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.98)).current;
  const liftY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 20,
        stiffness: 150,
        mass: 0.5,
        useNativeDriver: true,
      }),
    ]).start();

    const showKbd = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        Animated.spring(liftY, {
          toValue: -16,
          damping: 20,
          stiffness: 180,
          mass: 0.6,
          useNativeDriver: true,
        }).start();
      },
    );

    const hideKbd = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.spring(liftY, {
          toValue: 0,
          damping: 18,
          stiffness: 150,
          mass: 0.6,
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      showKbd.remove();
      hideKbd.remove();
    };
  }, []);

  const scrollViewRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true);
      return () => {
        setHideTabBar(false);
        hideModal();
      };
    }, [setHideTabBar, hideModal]),
  );

  const handleScroll = (e: any) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handlePickerPress = (items: any[], setter: (v: any) => void) => {
    const pickerItems: PickerItem[] = items.map((item) => ({
      label: item.label,
      onPress: () => {
        setter(item);
        hideModal();
      },
    }));

    showModal({
      content: <PickerModal items={pickerItems} onClose={hideModal} />,
    });
  };

  const handleDatePress = () => {
    if (!period) {
      toast({ message: "Please select a leave period first", variant: "error" });
      return;
    }

    showModal({
      content: (
        <DatePicker
          mode={isFullDay ? "RANGE" : "SINGLE"}
          initialDate={
            dateRange.start || new Date().toISOString().split("T")[0]
          }
          initialRange={
            dateRange.start
              ? dateRange
              : {
                  start: new Date().toISOString().split("T")[0],
                  end: new Date().toISOString().split("T")[0],
                }
          }
          onConfirm={(val) => {
            if (typeof val === "string") {
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

  const openClinic = () => {
    showModal({
      content: (
        <ClinicPicker
          title="Select Clinic"
          onDone={(selected) => {
            setClinic(selected);
            hideModal();
          }}
          onClose={hideModal}
        />
      ),
    });
  };

  const openAttachment = () => {
    showModal({
      content: (
        <DocumentPicker
          title="Attach Document"
          subtitle={
            requiresAttachment
              ? "Supporting document is required."
              : "Attach a supporting document (optional)."
          }
          onConfirm={(payload) => {
            setAttachment({
              uri: payload.uri,
              name: payload.name,
              type: payload.type,
            });
            setAttachmentName(payload.name);
            setAttachmentRef(payload.referenceNo);
            hideModal();
          }}
        />
      ),
    });
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    showLoader("Submitting request...");

    try {
      await submitLeaveRequest({
        leaveType: leaveType.value,
        period: period.value,
        range: dateRange,
        reasonType: reason.value,
        remarks,
        clinicId: clinic?.clinic_id,
        illness,
        attachment,
        attachmentRef,
      });
    } finally {
      hideLoader();
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Text
        variant="labelLarge"
        style={{ fontWeight: "600", color: theme.colors.onSurfaceVariant }}
      >
        {label}:
      </Text>
      <Text
        variant="labelLarge"
        style={{ fontWeight: "700", color: theme.colors.onSurface }}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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

        <Animated.View
          style={{
            opacity,
            transform: [{ scale }, { translateY: liftY }],
          }}
        >
          <Card
            mode="elevated"
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: tokens.radii.xl,
              elevation: 4,
            }}
          >
            <View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}>
              <Pressable
                onPress={() =>
                  handlePickerPress(options.leaveTypes, (v) => {
                    setLeaveType(v);
                    setClinic(null);
                    setIllness("");
                  })
                }
              >
                <View pointerEvents="none">
                  <TextInput
                    label="Leave Type"
                    mode="outlined"
                    value={leaveType?.label || ""}
                    editable={false}
                  />
                </View>
              </Pressable>

              <Pressable
                onPress={() =>
                  handlePickerPress(options.leavePeriods, (v) => {
                    setPeriod(v);
                    setDateRange({ start: "", end: "" });
                  })
                }
              >
                <View pointerEvents="none">
                  <TextInput
                    label="Leave Period"
                    mode="outlined"
                    value={period?.label || ""}
                    editable={false}
                  />
                </View>
              </Pressable>

              <Pressable onPress={handleDatePress}>
                <View pointerEvents="none">
                  <TextInput
                    label={isFullDay ? "Date Range" : "Date"}
                    mode="outlined"
                    value={
                      !dateRange.start
                        ? ""
                        : isFullDay
                        ? buildDateRangeLabel(
                            dateRange.start,
                            dateRange.end,
                          )
                        : dateRange.start
                    }
                    editable={false}
                  />
                </View>
              </Pressable>

              {duration > 0 && (
                <InfoRow label="Duration" value={`${duration} day(s)`} />
              )}

              <Pressable
                onPress={() =>
                  handlePickerPress(options.leaveReasons, (v) => setReason(v))
                }
              >
                <View pointerEvents="none">
                  <TextInput
                    label="Reason"
                    mode="outlined"
                    value={reason?.label || ""}
                    editable={false}
                  />
                </View>
              </Pressable>

              {isMedical && (
                <>
                  <Pressable onPress={openClinic}>
                    <View pointerEvents="none">
                      <TextInput
                        label="Clinic"
                        mode="outlined"
                        value={clinic?.clinic_name ?? ""}
                        placeholder="Select clinic"
                        editable={false}
                      />
                    </View>
                  </Pressable>

                  <TextInput
                    label="Illness"
                    mode="outlined"
                    value={illness}
                    onChangeText={setIllness}
                  />
                </>
              )}

              <Pressable onPress={openAttachment}>
                <View pointerEvents="none">
                  <TextInput
                    label={
                      requiresAttachment
                        ? "Attachment (Required)"
                        : "Attachment (Optional)"
                    }
                    mode="outlined"
                    value={attachmentName}
                    placeholder="Tap to attach document"
                    editable={false}
                  />
                </View>
              </Pressable>

              {attachmentRef ? (
                <InfoRow label="Reference" value={attachmentRef} />
              ) : null}

              <TextInput
                label="Remarks (optional)"
                mode="outlined"
                value={remarks}
                onChangeText={setRemarks}
                multiline
                numberOfLines={3}
              />

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
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
        </Animated.View>
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </KeyboardAvoidingView>
  );
}
