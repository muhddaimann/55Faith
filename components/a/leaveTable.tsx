import React, { useState, useMemo, useEffect } from "react";
import { View, Pressable, FlatList } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../contexts/overlayContext";
import { useLoader } from "../../contexts/loaderContext";
import useLeave from "../../hooks/useLeave";
import { LeaveItem } from "../../constants/leave";
import LeaveCard from "./leaveCard";
import LeaveModalContent from "./leaveModal";
import NoData from "../noData";

type Props = {
  history: LeaveItem[];
};

type FilterValue = "all" | "pending" | "approved" | "rejected";

export default function LeaveTable({ history }: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  const { showModal, hideModal, confirm, toast } = useOverlay();
  const { showLoader, hideLoader } = useLoader();
  const { withdrawRequest } = useLeave();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!ready && history.length > 0) {
      showLoader();
    }

    const timer = setTimeout(() => {
      if (isMounted) {
        setReady(true);
        hideLoader();
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      hideLoader();
    };
  }, [ready, history.length, showLoader, hideLoader]);

  const tabs: { label: string; value: FilterValue }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const filtered = useMemo(() => {
    if (filter === "all") return history;
    return history.filter((item) => item.status.toLowerCase() === filter);
  }, [filter, history]);

  const handleWithdraw = async (item: LeaveItem) => {
    hideModal();

    confirm({
      title: "Withdraw Leave",
      message: "Are you sure you want to withdraw this application?",
      onConfirm: async () => {
        showLoader("Withdrawing...");
        try {
          await withdrawRequest(Number(item.id));
        } finally {
          hideLoader();
        }
      },
    });
  };

  const onLeavePress = (item: LeaveItem) => {
    showModal({
      content: (
        <LeaveModalContent
          leave={item.raw}
          onWithdraw={() => handleWithdraw(item)}
        />
      ),
    });
  };

  if (!ready) {
    return null;
  }

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: tokens.radii.lg,
          padding: tokens.spacing.xxs,
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
                backgroundColor: isActive
                  ? theme.colors.surface
                  : "transparent",
              }}
            >
              <Text
                variant="labelLarge"
                style={{
                  color: isActive
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant,
                  fontWeight: isActive ? "700" : "500",
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <NoData
          title="No Applications"
          message={`No ${filter} leave records found.`}
          icon="calendar-blank"
        />
      ) : (
        <FlatList
          data={filtered}
          renderItem={({ item }) => (
            <LeaveCard item={item} onPress={() => onLeavePress(item)} />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <View style={{ height: tokens.spacing.sm }} />
          )}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
}
