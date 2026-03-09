import React from "react";
import { View } from "react-native";
import { Text, Card, useTheme, Divider } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Broadcast } from "../../contexts/api/broadcast";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  broadcast: Broadcast;
  onPress: (broadcast: Broadcast) => void;
  lines?: number;
};

export default function NewsflashCard({ broadcast, onPress, lines = 2 }: Props) {
  const theme = useTheme();
  const tokens = useDesign();

  const isAcknowledge = broadcast.Acknowledged === 1;
  const priority = broadcast.BroadcastPriority;

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "Critical": return theme.colors.error;
      case "High":
      case "Important": return theme.colors.tertiary;
      default: return theme.colors.primary;
    }
  };

  const getPriorityBg = (p: string) => {
    switch (p) {
      case "Critical": return theme.colors.errorContainer;
      case "High":
      case "Important": return theme.colors.tertiaryContainer;
      default: return theme.colors.primaryContainer;
    }
  };

  const priorityColor = getPriorityColor(priority);
  const priorityBg = getPriorityBg(priority);
  const previewText = stripHtml(broadcast.Content || broadcast.Description);

  return (
    <Card
      mode={isAcknowledge ? "contained" : "elevated"}
      onPress={() => onPress(broadcast)}
      style={{
        borderRadius: tokens.radii.lg,
        backgroundColor: isAcknowledge ? theme.colors.surfaceVariant : theme.colors.surface,
        elevation: isAcknowledge ? 0 : 2,
      }}
    >
      <View style={{ padding: tokens.spacing.md }}>
        <View style={{ flexDirection: "row", gap: 6, marginBottom: tokens.spacing.sm }}>
          {/* Priority Pill - Always Colored */}
          <View style={{ 
            paddingHorizontal: 8, 
            paddingVertical: 2, 
            borderRadius: 4, 
            backgroundColor: priorityBg 
          }}>
            <Text 
              variant="labelSmall" 
              style={{ color: priorityColor, fontWeight: "700", fontSize: 10 }}
              numberOfLines={1}
            >
              {priority.toUpperCase()}
            </Text>
          </View>
          {/* Type Pill */}
          <View style={{ 
            paddingHorizontal: 8, 
            paddingVertical: 2, 
            borderRadius: 4, 
            backgroundColor: isAcknowledge ? theme.colors.background : theme.colors.surfaceVariant,
            maxWidth: 140,
          }}>
            <Text 
              variant="labelSmall" 
              style={{ color: theme.colors.onSurfaceVariant, fontWeight: "700", fontSize: 10 }}
              numberOfLines={1}
            >
              {broadcast.BroadcastType.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={{ gap: 4, marginBottom: tokens.spacing.md }}>
          <Text 
            variant="titleMedium" 
            style={{ 
              fontWeight: isAcknowledge ? "500" : "700",
              color: isAcknowledge ? theme.colors.onSurfaceVariant : theme.colors.onSurface,
            }} 
            numberOfLines={1}
          >
            {broadcast.NewsName}
          </Text>
          
          <Text
            variant="bodyMedium"
            style={{ 
              color: theme.colors.onSurfaceVariant,
              lineHeight: 20,
              opacity: isAcknowledge ? 0.7 : 1
            }}
            numberOfLines={lines}
          >
            {previewText}
          </Text>
        </View>

        <Divider style={{ marginBottom: tokens.spacing.sm, opacity: 0.3 }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 }}>
            <MaterialCommunityIcons name="account-edit-outline" size={14} color={theme.colors.onSurfaceVariant} style={{ opacity: 0.6 }} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.8 }} numberOfLines={1}>
              {broadcast.CreatedBy}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={theme.colors.onSurfaceVariant} style={{ opacity: 0.6 }} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.8 }}>
              {broadcast.CreatedDateTime}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
