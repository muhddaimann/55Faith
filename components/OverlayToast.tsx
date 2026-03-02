import React, { useEffect, useRef } from "react";
import { Animated, View, TouchableOpacity, StyleSheet } from "react-native";
import { Surface, Text, useTheme, Icon, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../contexts/designContext";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

type Props = {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
  variant?: ToastVariant;
  icon?: string;
};

export function OverlayToast({
  visible,
  message,
  actionLabel,
  onAction,
  onDismiss,
  duration = 3000,
  variant = "default",
  icon,
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const variantConfig = {
    default: {
      bg: theme.colors.inverseSurface,
      text: theme.colors.inverseOnSurface,
      icon: icon ?? "information-outline",
    },
    success: {
      bg: theme.colors.tertiaryContainer,
      text: theme.colors.onTertiaryContainer,
      icon: icon ?? "check-circle-outline",
    },
    error: {
      bg: theme.colors.errorContainer,
      text: theme.colors.onErrorContainer,
      icon: icon ?? "alert-circle-outline",
    },
    warning: {
      bg: theme.colors.secondaryContainer,
      text: theme.colors.onSecondaryContainer,
      icon: icon ?? "alert-outline",
    },
    info: {
      bg: theme.colors.primaryContainer,
      text: theme.colors.onPrimaryContainer,
      icon: icon ?? "information-outline",
    },
  }[variant];

  useEffect(() => {
    if (!visible) return;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: insets.top + tokens.spacing.lg,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(hide, duration);
    return () => clearTimeout(timer);
  }, [visible, insets.top]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Portal>
      <View
        pointerEvents="box-none"
        style={[styles.container, { paddingHorizontal: tokens.spacing.lg }]}
      >
        <Animated.View
          style={{
            opacity,
            transform: [{ translateY }],
            alignItems: "center",
            width: '100%',
          }}
        >
          <Surface
            elevation={4}
            style={[
              styles.content,
              {
                borderRadius: tokens.radii.lg,
                backgroundColor: variantConfig.bg,
                gap: tokens.spacing.sm,
              }
            ]}
          >
            <Icon
              source={variantConfig.icon}
              size={20}
              color={variantConfig.text}
            />

            <Text
              variant="bodyMedium"
              style={{
                flex: 1,
                color: variantConfig.text,
              }}
            >
              {message}
            </Text>

            {actionLabel && (
              <TouchableOpacity
                onPress={() => {
                  onAction?.();
                  hide();
                }}
              >
                <Text
                  variant="labelLarge"
                  style={{
                    color: variantConfig.text,
                  }}
                >
                  {actionLabel.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
          </Surface>
        </Animated.View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9999,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: 640,
    width: "100%",
  },
});
