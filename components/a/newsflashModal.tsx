import React, { useEffect, useState } from "react";
import { View, ScrollView, useWindowDimensions, Linking } from "react-native";
import { Text, Button, Divider, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Broadcast } from "../../contexts/api/broadcast";
import RenderHtml from "react-native-render-html";

type Props = {
  broadcast: Broadcast;
  onAcknowledge?: (id: number) => void;
  onClose: () => void;
};

export default function NewsflashModalContent({
  broadcast,
  onAcknowledge,
  onClose,
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  const { width } = useWindowDimensions();

  const acknowledged = broadcast.Acknowledged === 1;

  const [countdown, setCountdown] = useState(3);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (acknowledged) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const htmlContent = broadcast.Content || broadcast.Description;

  const tagsStyles = {
    p: {
      color: theme.colors.onSurface,
      marginBottom: 8,
      fontSize: 15,
      lineHeight: 21,
    },
    strong: {
      fontWeight: "bold" as const,
    },
    span: {
      fontSize: 15,
    },
    a: {
      color: theme.colors.primary,
      textDecorationLine: "underline" as const,
    },
  };

  const renderersProps = {
    a: {
      onPress: (_: any, href: string) => {
        if (href) Linking.openURL(href);
      },
    },
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "Critical":
        return theme.colors.error;
      case "High":
      case "Important":
        return theme.colors.tertiary;
      default:
        return theme.colors.primary;
    }
  };

  const getPriorityBg = (p: string) => {
    switch (p) {
      case "Critical":
        return theme.colors.errorContainer;
      case "High":
      case "Important":
        return theme.colors.tertiaryContainer;
      default:
        return theme.colors.primaryContainer;
    }
  };

  const priorityColor = getPriorityColor(broadcast.BroadcastPriority);
  const priorityBg = getPriorityBg(broadcast.BroadcastPriority);

  const handleAcknowledge = () => {
    onAcknowledge?.(broadcast.ID);
    onClose();
  };

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
            backgroundColor: priorityBg,
          }}
        >
          <Text
            variant="labelSmall"
            style={{ color: priorityColor, fontWeight: "700", fontSize: 10 }}
          >
            {broadcast.BroadcastPriority.toUpperCase()}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
            backgroundColor: theme.colors.surfaceVariant,
            maxWidth: "100%",
          }}
        >
          <Text
            variant="labelSmall"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: theme.colors.onSurfaceVariant,
              fontWeight: "700",
              fontSize: 10,
            }}
          >
            {broadcast.BroadcastType.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={{ gap: 2 }}>
        <Text variant="titleMedium" style={{ fontWeight: "700" }}>
          {broadcast.NewsName}
        </Text>

        <Text
          variant="labelSmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {broadcast.CreatedBy} · {broadcast.CreatedDateTime}
        </Text>
      </View>

      <Divider />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 360 }}
      >
        <RenderHtml
          contentWidth={width - tokens.spacing.xl * 2}
          source={{ html: htmlContent }}
          tagsStyles={tagsStyles}
          renderersProps={renderersProps}
        />
      </ScrollView>

      <Button
        mode={acknowledged ? "outlined" : "contained"}
        disabled={acknowledged || !ready}
        onPress={handleAcknowledge}
        contentStyle={{ height: 44 }}
        style={{ borderRadius: tokens.radii.md }}
      >
        {acknowledged
          ? "Acknowledged"
          : ready
            ? "Acknowledge"
            : `Acknowledge (${countdown})`}
      </Button>
    </View>
  );
}
