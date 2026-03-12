import React, { useState, useEffect } from "react";
import { View, FlatList, Pressable, ActivityIndicator } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { useDesign } from "../contexts/designContext";
import { Clinic, searchClinics } from "../contexts/api/clinic";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ClinicPickerProps = {
  title: string;
  onDone: (clinic: Clinic) => void;
  onClose: () => void;
};

export default function ClinicPicker({ title, onDone, onClose }: ClinicPickerProps) {
  const theme = useTheme();
  const tokens = useDesign();
  const [query, setQuery] = useState("");
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await searchClinics(query);
        setClinics(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetch, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View style={{ gap: tokens.spacing.md, maxHeight: 500 }}>
      <Text variant="titleMedium" style={{ fontWeight: "700", textAlign: "center" }}>
        {title}
      </Text>

      <TextInput
        mode="outlined"
        placeholder="Search clinic..."
        value={query}
        onChangeText={setQuery}
        left={<TextInput.Icon icon="magnify" />}
        style={{ backgroundColor: theme.colors.surface }}
      />

      {loading && <ActivityIndicator style={{ marginVertical: tokens.spacing.md }} />}

      <FlatList
        data={clinics}
        keyExtractor={(item) => String(item.clinic_id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: tokens.spacing.xs }}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ textAlign: "center", padding: tokens.spacing.lg, color: theme.colors.onSurfaceVariant }}>
              No clinics found
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              onDone(item);
              onClose();
            }}
            style={({ pressed }) => ({
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              backgroundColor: pressed ? theme.colors.surfaceVariant : theme.colors.background,
              borderWidth: 1,
              borderColor: theme.colors.outlineVariant,
            })}
          >
            <Text variant="bodyLarge" style={{ fontWeight: "600" }}>{item.clinic_name}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{item.address}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
