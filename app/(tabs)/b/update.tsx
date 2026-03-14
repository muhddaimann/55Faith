import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from "react-native";
import { Text, Card, useTheme, TextInput, Button } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/header";
import { useStaffStore } from "../../../contexts/api/staffStore";
import { useOverlay } from "../../../contexts/overlayContext";
import { useLoader } from "../../../contexts/loaderContext";
import { useRouter } from "expo-router";

export default function ProfileUpdatePage() {
  const theme = useTheme();
  const tokens = useDesign();
  const router = useRouter();
  const { setHideTabBar } = useTabs();
  const { toast } = useOverlay();
  const { showLoader, hideLoader } = useLoader();
  const { staff, updateStaff } = useStaffStore();

  const [nickName, setNickName] = useState(staff?.nick_name || "");
  const [email, setEmail] = useState(staff?.email || "");
  const [contactNo, setContactNo] = useState(staff?.contact_no || "");
  const [address1, setAddress1] = useState(staff?.address1 || "");
  const [address2, setAddress2] = useState(staff?.address2 || "");
  const [address3, setAddress3] = useState(staff?.address3 || "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.98)).current;
  const liftY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 20,
        stiffness: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const showKbd = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        Animated.spring(liftY, {
          toValue: -20,
          damping: 20,
          stiffness: 180,
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
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      showKbd.remove();
      hideKbd.remove();
    };
  }, []);

  const handleUpdate = async () => {
    showLoader("Updating profile...");
    setSubmitting(true);
    try {
      const res = await updateStaff({
        nick_name: nickName,
        email: email,
        contact_no: contactNo,
        address1,
        address2,
        address3,
      });

      if (res.success) {
        toast({ message: "Profile updated successfully", variant: "success" });
        router.back();
      } else {
        toast({
          message: res.error || "Failed to update profile",
          variant: "error",
        });
      }
    } catch {
      toast({ message: "An unexpected error occurred", variant: "error" });
    } finally {
      setSubmitting(false);
      hideLoader();
    }
  };

  const isChanged =
    nickName !== (staff?.nick_name || "") ||
    email !== (staff?.email || "") ||
    contactNo !== (staff?.contact_no || "") ||
    address1 !== (staff?.address1 || "") ||
    address2 !== (staff?.address2 || "") ||
    address3 !== (staff?.address3 || "");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"],
          gap: tokens.spacing.lg,
        }}
      >
        <Header
          title="Edit Profile"
          subtitle="Update your personal details"
          showBack
          showProfile
        />

        <Animated.View
          style={{
            opacity,
            transform: [{ scale }, { translateY: liftY }],
          }}
        >
          <Card
            mode="elevated"
            style={{
              borderRadius: tokens.radii.xl,
              backgroundColor: theme.colors.surface,
              elevation: 4,
            }}
          >
            <View
              style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}
            >
              <TextInput
                label="Nickname"
                mode="outlined"
                value={nickName}
                onChangeText={setNickName}
                left={<TextInput.Icon icon="account-outline" />}
              />

              <TextInput
                label="Email"
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email-outline" />}
              />

              <TextInput
                label="Contact Number"
                mode="outlined"
                value={contactNo}
                onChangeText={setContactNo}
                keyboardType="phone-pad"
                left={<TextInput.Icon icon="phone-outline" />}
              />

              <TextInput
                label="Address Line 1"
                mode="outlined"
                value={address1}
                onChangeText={setAddress1}
                left={<TextInput.Icon icon="map-marker-outline" />}
              />

              <TextInput
                label="Address Line 2"
                mode="outlined"
                value={address2}
                onChangeText={setAddress2}
              />

              <TextInput
                label="Address Line 3"
                mode="outlined"
                value={address3}
                onChangeText={setAddress3}
              />

              <Button
                mode="contained"
                onPress={handleUpdate}
                loading={submitting}
                disabled={!isChanged || submitting}
                style={{
                  borderRadius: tokens.radii.lg,
                  marginTop: tokens.spacing.md,
                }}
                contentStyle={{ height: 48 }}
              >
                Save Changes
              </Button>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
