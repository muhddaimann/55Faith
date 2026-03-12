import React from "react";
import { View, Pressable, FlatList } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../contexts/designContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type PickerItem = {
  label: string;
  icon?: string;
  onPress: () => void;
};

type PickerModalProps = {
  title?: string;
  items: PickerItem[];
  onClose: () => void;
};

export default function PickerModal({
  title,
  items,
  onClose,
}: PickerModalProps) {
  const { colors } = useTheme();
  const tokens = useDesign();

  const hasTitle = !!title;

  return (
    <View
      style={{
        gap: hasTitle ? tokens.spacing.md : tokens.spacing.sm,
        maxHeight: 400,
      }}
    >
      {hasTitle && (
        <Text
          variant="titleMedium"
          style={{
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      )}

      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: tokens.spacing.xs,
          marginTop: hasTitle ? 0 : tokens.spacing.xs,
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              onClose();
              item.onPress();
            }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.md,
              paddingVertical: tokens.spacing.md,
              paddingHorizontal: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              backgroundColor: pressed
                ? colors.surfaceVariant
                : colors.background,
            })}
          >
            {item.icon && (
              <MaterialCommunityIcons
                name={item.icon as any}
                size={22}
                color={colors.primary}
              />
            )}
            <Text variant="bodyLarge" style={{ flex: 1 }}>
              {item.label}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
