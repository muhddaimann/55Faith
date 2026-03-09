import React from "react";
import { ScrollView, View, Dimensions } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function NewsFlashCarousel() {
  const { colors } = useTheme();
  const tokens = useDesign();

  const data = [
    {
      title: "System Maintenance",
      description: "Scheduled maintenance tonight at 11:00 PM.",
      icon: "tools",
    },
    {
      title: "HR Policy Update",
      description: "New leave policy effective next month.",
      icon: "file-document-outline",
    },
    {
      title: "Office Closure",
      description: "Office closed this Friday for maintenance.",
      icon: "office-building-outline",
    },
  ];

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
        }}
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              width: width * 0.75,
              marginRight: index !== data.length - 1 ? tokens.spacing.md : 0,
              paddingBottom: tokens.spacing.xs,
            }}
          >
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
                  width: 40,
                  height: 40,
                  borderRadius: tokens.radii.full,
                  backgroundColor: colors.primaryContainer,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={20}
                  color={colors.primary}
                />
              </View>

              <View style={{ gap: tokens.spacing.xs }}>
                <Text variant="titleMedium" style={{ fontWeight: "600" }}>
                  {item.title}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {item.description}
                </Text>
              </View>
            </Card>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
