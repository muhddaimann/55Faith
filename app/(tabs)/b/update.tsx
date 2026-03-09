import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Text, Card, useTheme, Divider } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import Header from "../../../components/header";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfilePage() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, []);

  const profile = {
    nickname: "Maiman",
    email: "maiman@example.com",
    phone: "+60 12-345 6789",
    address: "No.12 Jalan Melaka Raya,\n75000 Melaka, Malaysia",
  };

  const rows = [
    {
      label: "Nickname",
      value: profile.nickname,
      icon: "account-outline",
    },
    {
      label: "Email",
      value: profile.email,
      icon: "email-outline",
    },
    {
      label: "Contact Number",
      value: profile.phone,
      icon: "phone-outline",
    },
    {
      label: "Address",
      value: profile.address,
      icon: "map-marker-outline",
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
          title="Profile"
          subtitle="Your personal information"
          showBack
        />

        <Card
          mode="elevated"
          style={{
            borderRadius: tokens.radii.xl,
            backgroundColor: theme.colors.surface,
          }}
          contentStyle={{
            padding: tokens.spacing.md,
          }}
        >
          {rows.map((item, index) => (
            <View key={index}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: tokens.spacing.md,
                  paddingVertical: tokens.spacing.sm,
                }}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={20}
                  color={theme.colors.primary}
                />

                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {item.label}
                  </Text>

                  <Text
                    variant="bodyMedium"
                    style={{ fontWeight: "600", lineHeight: 20 }}
                  >
                    {item.value}
                  </Text>
                </View>
              </View>

              {index !== rows.length - 1 && <Divider />}
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}