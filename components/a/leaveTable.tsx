import React, { useState, useMemo } from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Leave } from "../../contexts/api/leave";
import LeaveCard from "./leaveCard";
import NoData from "../noData";

type Props = {
  leaves: Leave[];
  pending: Leave[];
  approved: Leave[];
  rejected: Leave[];
  onLeavePress: (leave: Leave) => void;
};

type FilterValue = "all" | "pending" | "approved" | "rejected";

export default function LeaveTable({ 
  leaves, 
  pending, 
  approved, 
  rejected, 
  onLeavePress 
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  const [filter, setFilter] = useState<FilterValue>("all");

  const tabs: { label: string; value: FilterValue }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const filteredLeaves = useMemo(() => {
    switch (filter) {
      case "pending": return pending;
      case "approved": return approved;
      case "rejected": return rejected;
      default: return leaves;
    }
  }, [filter, leaves, pending, approved, rejected]);

  const getEmptyState = () => {
    const title = filter === "all" ? "No Applications" : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Applications`;
    const message = filter === "all" 
      ? "You haven't submitted any leave applications yet." 
      : `You don't have any leave applications with ${filter} status.`;
    
    return { title, message };
  };

  return (
    <View style={{ flex: 1 }}>
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
          return (
            <Pressable
              key={tab.value}
              onPress={() => setFilter(tab.value)}
              style={{
                flex: 1,
                paddingVertical: 8,
                alignItems: "center",
                borderRadius: tokens.radii.md,
                backgroundColor: isActive ? theme.colors.surface : "transparent",
                elevation: isActive ? 2 : 0,
              }}
            >
              <Text
                variant="labelLarge"
                style={{
                  color: isActive ? theme.colors.primary : theme.colors.onSurfaceVariant,
                  fontWeight: isActive ? "700" : "500",
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1 }}>
        {filteredLeaves.length === 0 ? (
          <NoData 
            title={getEmptyState().title}
            message={getEmptyState().message}
            icon="calendar-blank"
          />
        ) : (
          filteredLeaves.map((leave) => (
            <LeaveCard
              key={leave.leave_id}
              leave={leave}
              onPress={onLeavePress}
            />
          ))
        )}
      </View>
    </View>
  );
}
