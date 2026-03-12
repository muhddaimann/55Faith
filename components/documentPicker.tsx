import React, { useState } from "react";
import { View, Pressable } from "react-native";
import {
  Text,
  IconButton,
  TextInput,
  Button,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../contexts/designContext";
import { useUpload } from "../hooks/useUpload";

type DocumentPickerProps = {
  title: string;
  subtitle?: string;
  icon?: string;
  onConfirm: (payload: {
    uri: string;
    name: string;
    type: string;
    referenceNo: string;
  }) => void;
};

export default function DocumentPicker({
  title,
  subtitle = "Choose a file to attach",
  icon = "paperclip",
  onConfirm,
}: DocumentPickerProps) {
  const { colors } = useTheme();
  const tokens = useDesign();

  const {
    attachedDocument,
    setAttachedDocument,
    tooLarge,
    setTooLarge,
    pickFromCamera,
    pickFromGallery,
    pickFromFiles,
  } = useUpload();

  const [referenceNo, setReferenceNo] = useState("");
  const hasAttachment = !!attachedDocument;

  const reset = () => {
    setAttachedDocument(null);
    setReferenceNo("");
    setTooLarge(false);
  };

  return (
    <View
      style={{
        gap: tokens.spacing.sm,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: 2, flex: 1 }}>
          <Text variant="titleMedium" style={{ fontWeight: "700" }}>
            {title}
          </Text>
          {!hasAttachment && (
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={colors.primary}
        />
      </View>

      {tooLarge && (
        <View
          style={{
            padding: tokens.spacing.sm,
            backgroundColor: colors.errorContainer,
            borderRadius: tokens.radii.md,
          }}
        >
          <Text
            variant="bodySmall"
            style={{ color: colors.onErrorContainer, fontWeight: "600" }}
          >
            File is too large (max 5MB). Please try another file.
          </Text>
        </View>
      )}

      {!hasAttachment && (
        <View style={{ gap: tokens.spacing.sm }}>
          <Pressable
            onPress={pickFromCamera}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.md,
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              backgroundColor: colors.surfaceVariant,
            }}
          >
            <MaterialCommunityIcons
              name="camera-outline"
              size={20}
              color={colors.onSurface}
            />
            <Text>Take photo</Text>
          </Pressable>

          <Pressable
            onPress={pickFromGallery}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.md,
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              backgroundColor: colors.surfaceVariant,
            }}
          >
            <MaterialCommunityIcons
              name="image-outline"
              size={20}
              color={colors.onSurface}
            />
            <Text>Choose from gallery</Text>
          </Pressable>

          <Pressable
            onPress={pickFromFiles}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.md,
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              backgroundColor: colors.surfaceVariant,
            }}
          >
            <MaterialCommunityIcons
              name="file-document-outline"
              size={20}
              color={colors.onSurface}
            />
            <Text>Browse files (PDF / Image)</Text>
          </Pressable>
        </View>
      )}

      {hasAttachment && (
        <View style={{ gap: tokens.spacing.sm }}>
          <View
            style={{
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              backgroundColor: colors.primaryContainer,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{ fontWeight: "600", color: colors.onPrimaryContainer }}
              >
                {attachedDocument.name}
              </Text>
              <Text
                variant="labelSmall"
                style={{ color: colors.onPrimaryContainer }}
              >
                Attachment added
              </Text>
            </View>

            <IconButton
              icon="close"
              size={18}
              iconColor={colors.onPrimaryContainer}
              onPress={reset}
              style={{ margin: 0 }}
            />
          </View>

          <TextInput
            mode="outlined"
            label="Reference number"
            placeholder="Enter reference number"
            value={referenceNo}
            onChangeText={setReferenceNo}
          />

          <Button
            mode="contained"
            disabled={!referenceNo.trim()}
            style={{ marginTop: tokens.spacing.sm }}
            onPress={() => {
              onConfirm({
                ...attachedDocument,
                referenceNo: referenceNo.trim(),
              });
            }}
          >
            Confirm attachment
          </Button>
        </View>
      )}
    </View>
  );
}
