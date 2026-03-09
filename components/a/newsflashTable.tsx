import React, { useState, useMemo } from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Broadcast } from "../../contexts/api/broadcast";
import NewsflashCard from "./newsflashCard";
import NoData from "../noData";

type Props = {
  broadcasts: Broadcast[];
  critical: Broadcast[];
  important: Broadcast[];
  normal: Broadcast[];
  onPress: (broadcast: Broadcast) => void;
};

type FilterValue = "all" | "critical" | "important" | "normal";

export default function NewsflashTable({
  broadcasts,
  critical,
  important,
  normal,
  onPress,
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  const [filter, setFilter] = useState<FilterValue>("all");

  const getPriorityColors = (type: FilterValue) => {
    switch (type) {
      case "critical":
        return {
          activeBg: theme.colors.errorContainer,
          activeText: theme.colors.error,
        };
      case "important":
        return {
          activeBg: theme.colors.tertiaryContainer,
          activeText: theme.colors.tertiary,
        };
      case "normal":
        return {
          activeBg: theme.colors.primaryContainer,
          activeText: theme.colors.primary,
        };
      default:
        return {
          activeBg: theme.colors.surface,
          activeText: theme.colors.primary,
        };
    }
  };

  const tabs: { label: string; value: FilterValue }[] = [
    { label: "All", value: "all" },
    { label: "Critical", value: "critical" },
    { label: "Important", value: "important" },
    { label: "Normal", value: "normal" },
  ];

  const sortBroadcasts = (data: Broadcast[], prioritizeAck: boolean) => {
    return [...data].sort((a, b) => {
      if (prioritizeAck && a.Acknowledged !== b.Acknowledged) {
        return a.Acknowledged - b.Acknowledged;
      }
      return (
        new Date(b.CreatedDateTime.replace(" ", "T")).getTime() -
        new Date(a.CreatedDateTime.replace(" ", "T")).getTime()
      );
    });
  };

  const filteredData = useMemo(() => {
    switch (filter) {
      case "critical":
        return sortBroadcasts(critical, true);
      case "important":
        return sortBroadcasts(important, true);
      case "normal":
        return sortBroadcasts(normal, true);
      default:
        return sortBroadcasts(broadcasts, false);
    }
  }, [filter, broadcasts, critical, important, normal]);

  return (
    <View style={{ flex: 1, marginBottom: tokens.spacing.md }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: tokens.radii.lg,
          padding: 4,
          marginBottom: tokens.spacing.md,
        }}
      >
        {tabs.map((tab) => {
          const isActive = filter === tab.value;
          const colors = getPriorityColors(tab.value);

          return (
            <Pressable
              key={tab.value}
              onPress={() => setFilter(tab.value)}
              style={{
                flex: 1,
                paddingVertical: 8,
                alignItems: "center",
                borderRadius: tokens.radii.md,
                backgroundColor: isActive ? colors.activeBg : "transparent",
                elevation: isActive ? 2 : 0,
              }}
            >
              <Text
                variant="labelSmall"
                style={{
                  color: isActive
                    ? colors.activeText
                    : theme.colors.onSurfaceVariant,
                  fontWeight: isActive ? "700" : "500",
                  fontSize: 11,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1, gap: tokens.spacing.md }}>
        {filteredData.length === 0 ? (
          <NoData
            title="No Announcements"
            message={`There are no ${filter === "all" ? "" : filter} notifications at this time.`}
            icon="bullhorn-outline"
          />
        ) : (
          filteredData.map((item) => (
            <NewsflashCard key={item.ID} broadcast={item} onPress={onPress} />
          ))
        )}
      </View>
    </View>
  );
}
