import React from "react";
import { View, Pressable } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMain } from "../../hooks/useMain";

export default function MainCard() {
  const { colors } = useTheme();
  const tokens = useDesign();
  const router = useRouter();

  const {
    dateLabel,
    roleLabel,
    current,
    holiday,
    start,
    end,
    actualLogin,
    actualLogout,
    loginConfig,
    logoutConfig,
    staffType,
    isPublicHoliday,
    showStatus,
    showWorkingHours,
    message,
    refreshData,
  } = useMain();

  const canNavigate = staffType === "operation";

  return (
    <Card
      mode="elevated"
      style={{
        borderRadius: tokens.radii.xl,
        backgroundColor: colors.surface,
      }}
      contentStyle={{
        padding: tokens.spacing.lg,
        gap: tokens.spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ gap: 2 }}>
          <Text variant="titleMedium" style={{ fontWeight: "700" }}>
            {dateLabel}
          </Text>

          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            {roleLabel}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
          <Pressable
            onPress={refreshData}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: tokens.radii.full,
              backgroundColor: colors.surfaceVariant,
              alignItems: "center",
              justifyContent: "center",
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <MaterialCommunityIcons
              name="refresh"
              size={22}
              color={colors.primary}
            />
          </Pressable>

          <Pressable
            disabled={!canNavigate}
            onPress={() => canNavigate && router.push("a/main")}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: tokens.radii.full,
              backgroundColor: colors.surfaceVariant,
              alignItems: "center",
              justifyContent: "center",
              opacity: canNavigate ? 1 : 0.4,
              transform: [{ scale: pressed && canNavigate ? 0.95 : 1 }],
            })}
          >
            <MaterialCommunityIcons
              name="calendar-outline"
              size={24}
              color={colors.primary}
            />
          </Pressable>
        </View>
      </View>

      {isPublicHoliday && holiday && (
        <View
          style={{
            backgroundColor: holiday.bg,
            borderRadius: tokens.radii.lg,
            paddingVertical: tokens.spacing.sm,
            paddingHorizontal: tokens.spacing.md,
            flexDirection: "row",
            alignItems: "center",
            gap: tokens.spacing.sm,
          }}
        >
          <MaterialCommunityIcons
            name={holiday.icon as any}
            size={18}
            color={holiday.color}
          />
          <Text
            variant="bodyMedium"
            style={{
              fontWeight: "600",
              color: holiday.color,
            }}
          >
            {holiday.label} · {holiday.name}
          </Text>
        </View>
      )}

      {showStatus && (
        <View
          style={{
            backgroundColor: current.bg,
            borderRadius: tokens.radii.lg,
            paddingVertical: tokens.spacing.sm,
            paddingHorizontal: tokens.spacing.md,
            flexDirection: "row",
            alignItems: "center",
            gap: tokens.spacing.sm,
          }}
        >
          <MaterialCommunityIcons
            name={current.icon as any}
            size={18}
            color={current.color}
          />
          <Text
            variant="bodyMedium"
            style={{
              fontWeight: "600",
              color: current.color,
            }}
          >
            {current.label}
          </Text>
        </View>
      )}

      {showWorkingHours ? (
        <View style={{ gap: tokens.spacing.md }}>
          <View style={{ flexDirection: "row", gap: tokens.spacing.md }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surfaceVariant,
                borderRadius: tokens.radii.lg,
                paddingVertical: tokens.spacing.sm,
                paddingHorizontal: tokens.spacing.md,
                gap: 2,
              }}
            >
              <Text
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                Shift Start
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                {start}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.surfaceVariant,
                borderRadius: tokens.radii.lg,
                paddingVertical: tokens.spacing.sm,
                paddingHorizontal: tokens.spacing.md,
                gap: 2,
              }}
            >
              <Text
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                Shift End
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                {end}
              </Text>
            </View>
          </View>

          {staffType === "operation" && (actualLogin || actualLogout) && (
            <View style={{ flexDirection: "row", gap: tokens.spacing.md }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: loginConfig?.bg || colors.surfaceVariant,
                  borderRadius: tokens.radii.lg,
                  paddingVertical: tokens.spacing.sm,
                  paddingHorizontal: tokens.spacing.md,
                  gap: 2,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text
                    variant="labelSmall"
                    style={{ color: loginConfig?.onBg || colors.onSurfaceVariant }}
                  >
                    Check In
                  </Text>
                  {loginConfig?.label && (
                    <Text
                      variant="labelSmall"
                      style={{ color: loginConfig.color, fontWeight: "700" }}
                    >
                      {loginConfig.label}
                    </Text>
                  )}
                </View>
                <Text
                  variant="bodyMedium"
                  style={{ 
                    fontWeight: "600",
                    color: loginConfig?.onBg || colors.onSurface 
                  }}
                >
                  {actualLogin || "--:--"}
                </Text>
                {loginConfig?.diff && (
                  <Text variant="labelSmall" style={{ color: loginConfig.color }}>
                    {loginConfig.diff}
                  </Text>
                )}
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: logoutConfig?.bg || colors.surfaceVariant,
                  borderRadius: tokens.radii.lg,
                  paddingVertical: tokens.spacing.sm,
                  paddingHorizontal: tokens.spacing.md,
                  gap: 2,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text
                    variant="labelSmall"
                    style={{ color: logoutConfig?.onBg || colors.onSurfaceVariant }}
                  >
                    Check Out
                  </Text>
                  {logoutConfig?.label && (
                    <Text
                      variant="labelSmall"
                      style={{ color: logoutConfig.color, fontWeight: "700" }}
                    >
                      {logoutConfig.label}
                    </Text>
                  )}
                </View>
                <Text
                  variant="bodyMedium"
                  style={{ 
                    fontWeight: "600",
                    color: logoutConfig?.onBg || colors.onSurface 
                  }}
                >
                  {actualLogout || "--:--"}
                </Text>
                {logoutConfig?.diff && (
                  <Text variant="labelSmall" style={{ color: logoutConfig.color }}>
                    {logoutConfig.diff}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      ) : (
        message !== "" && (
          <View
            style={{
              backgroundColor: colors.surfaceVariant,
              borderRadius: tokens.radii.lg,
              paddingVertical: tokens.spacing.md,
              paddingHorizontal: tokens.spacing.md,
            }}
          >
            <Text
              variant="bodyMedium"
              style={{
                color: colors.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              {message}
            </Text>
          </View>
        )
      )}
    </Card>
  );
}
