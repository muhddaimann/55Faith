import React from "react";
import { ScrollView, View } from "react-native";
import { Text, List, Switch, Divider, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useAppTheme } from "../../contexts/themeContext";

export default function Settings() {
  const theme = useTheme();
  const tokens = useDesign();
  const { isDark, toggle } = useAppTheme();

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
        Settings
      </Text>

      <List.Section>
        <List.Subheader style={{ color: theme.colors.primary }}>
          Appearance
        </List.Subheader>

        <List.Item
          title="Dark Mode"
          titleStyle={{ color: theme.colors.onSurface }}
          description="Switch between light and dark themes"
          descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          left={(props) => (
            <List.Icon
              {...props}
              color={theme.colors.onSurfaceVariant}
              icon="brightness-4"
            />
          )}
          right={() => (
            <Switch
              value={isDark}
              onValueChange={toggle}
              color={theme.colors.primary}
            />
          )}
        />

        <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />

        <List.Item
          title="Theme Primary"
          titleStyle={{ color: theme.colors.onSurface }}
          description={theme.colors.primary}
          descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          left={(props) => (
            <List.Icon
              {...props}
              color={theme.colors.onSurfaceVariant}
              icon="palette"
            />
          )}
          right={() => (
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: theme.colors.primary,
                alignSelf: "center",
              }}
            />
          )}
        />
      </List.Section>

      <List.Section>
        <List.Subheader style={{ color: theme.colors.primary }}>
          Application Info
        </List.Subheader>

        <List.Item
          title="Version"
          titleStyle={{ color: theme.colors.onSurface }}
          description="1.0.0 (v1)"
          descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          left={(props) => (
            <List.Icon
              {...props}
              color={theme.colors.onSurfaceVariant}
              icon="information-outline"
            />
          )}
        />
      </List.Section>
    </ScrollView>
  );
}
