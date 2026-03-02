import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Animated, View } from "react-native";
import { Surface, Text, IconButton, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, router } from "expo-router";
import { useDesign } from "../contexts/designContext";
import { useAuth } from "../contexts/authContext";

export function NavBar() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const tokens = useDesign();
  const pathname = usePathname();
  const { signOut } = useAuth();
  const isHome = pathname === "/home" || pathname === "/(tabs)/home";
  const isSettings = pathname === "/settings" || pathname === "/(tabs)/settings";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleActionButton = async () => {
    if (isHome) {
      console.log("Plus pressed");
    } else {
      await signOut();
      router.replace("/goodbye");
    }
  };

  const navItems = [
    {
      key: "home",
      label: "Home",
      icon: "home-variant",
      active: isHome,
      onPress: () => router.replace("/home"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: "cog-outline",
      active: isSettings,
      onPress: () => router.replace("/settings"),
    },
  ];

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom:
          (insets.bottom > 0 ? insets.bottom : tokens.spacing.md) +
          tokens.spacing.xl,
        left: tokens.spacing.lg,
        right: tokens.spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        gap: tokens.spacing.md,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Surface
        elevation={4}
        style={{
          flexDirection: "row",
          backgroundColor: theme.colors.surface,
          borderRadius: 999,
          height: 64,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: tokens.spacing.md,
          paddingBottom: tokens.spacing.xs,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
        }}
      >
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={item.onPress}
            activeOpacity={0.8}
            style={{
              flex: 1,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                icon={item.icon}
                size={item.active ? 26 : 22}
                iconColor={
                  item.active
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
                style={{ margin: 0 }}
              />
              <Text
                variant="labelSmall"
                style={{
                  marginTop: -6,
                  color: item.active
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant,
                }}
              >
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </Surface>

      <TouchableOpacity onPress={handleActionButton} activeOpacity={0.85}>
        <Surface
          elevation={4}
          style={{
            height: 64,
            width: 64,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isHome ? theme.colors.primary : theme.colors.error,
            borderWidth: 1,
            borderColor: isHome ? theme.colors.primary : theme.colors.error,
          }}
        >
          <IconButton
            icon={isHome ? "plus" : "logout"}
            size={28}
            iconColor={isHome ? theme.colors.onPrimary : theme.colors.onError}
            style={{ margin: 0 }}
          />
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );
}
