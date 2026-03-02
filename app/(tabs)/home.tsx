import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, useTheme, Surface } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../contexts/overlayContext";

export default function Home() {
  const theme = useTheme();
  const tokens = useDesign();
  const { alert, confirm, toast, showModal, hideModal } = useOverlay();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        padding: tokens.spacing.lg,
        gap: tokens.spacing.md,
        paddingBottom: tokens.spacing["3xl"],
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        variant="headlineMedium"
        style={{ color: theme.colors.onBackground }}
      >
        Overlay Demo
      </Text>

      <Surface
        elevation={1}
        style={{
          padding: tokens.spacing.lg,
          borderRadius: tokens.radii.lg,
          backgroundColor: theme.colors.surfaceVariant,
          gap: tokens.spacing.sm,
        }}
      >
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Interactive Components
        </Text>
        <Text
          variant="bodySmall"
          style={{
            color: theme.colors.onSurfaceVariant,
            opacity: 0.7,
          }}
        >
          Test the custom modular overlay system below.
        </Text>
      </Surface>

    </ScrollView>
  );
}
