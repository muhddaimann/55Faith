import React, { useMemo } from "react";
import { View } from "react-native";
import { Text, Card, Chip, useTheme, Divider } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { LeaveItem } from "../../constants/leave";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  item: LeaveItem;
  onPress: (item: LeaveItem) => void;
};

export default React.memo(function LeaveCard({ item, onPress }: Props) {
  const { colors } = useTheme();
  const tokens = useDesign();

  const statusStyle = useMemo(() => {
    switch (item.status) {
      case "APPROVED":
        return {
          bg: colors.tertiaryContainer,
          text: colors.onTertiaryContainer,
        };
      case "PENDING":
        return {
          bg: colors.primaryContainer,
          text: colors.onPrimaryContainer,
        };
      case "REJECTED":
        return {
          bg: colors.errorContainer,
          text: colors.onErrorContainer,
        };
      default:
        return {
          bg: colors.surfaceDisabled,
          text: colors.onSurfaceDisabled,
        };
    }
  }, [item.status, colors]);

  return (
    <Card
      mode="contained"
      onPress={() => onPress(item)}
      style={{
        borderRadius: tokens.radii.lg,
        backgroundColor: colors.surface,
        elevation: 2,
      }}
    >
      <View style={{ padding: tokens.spacing.md }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: tokens.spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.md,
              flex: 1,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.primaryContainer,
              }}
            >
              <MaterialCommunityIcons
                name="calendar-text"
                size={20}
                color={colors.primary}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                {item.name}
              </Text>

              <Text
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                {item.durationLabel}
              </Text>
            </View>
          </View>

          <Chip
            compact
            style={{ backgroundColor: statusStyle.bg }}
            textStyle={{ color: statusStyle.text, fontSize: 10, fontWeight: "700" }}
          >
            {item.statusMeta.label}
          </Chip>
        </View>

        <Divider style={{ marginBottom: tokens.spacing.sm }} />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: tokens.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.xs,
            }}
          >
            <MaterialCommunityIcons
              name="calendar-range"
              size={14}
              color={colors.onSurfaceVariant}
            />

            <Text
              variant="bodySmall"
              style={{
                opacity: 0.8,
                color: colors.onSurfaceVariant,
              }}
            >
              {item.dateRangeLabel}
            </Text>
          </View>

          {item.raw.reason && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: tokens.spacing.xs,
                flex: 1,
              }}
            >
              <MaterialCommunityIcons
                name="comment-text-outline"
                size={14}
                color={colors.onSurfaceVariant}
              />

              <Text
                variant="bodySmall"
                style={{
                  opacity: 0.8,
                  color: colors.onSurfaceVariant,
                }}
                numberOfLines={1}
              >
                {item.raw.reason}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
});
