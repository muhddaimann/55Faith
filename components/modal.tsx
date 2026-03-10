import React from "react";
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from "react-native";
import { Surface, useTheme, Portal } from "react-native-paper";
import { useDesign } from "../contexts/designContext";

type Props = {
  visible: boolean;
  content: React.ReactNode;
  onDismiss: () => void;
  dismissable?: boolean;
};

export function OverlayModal({
  visible,
  content,
  onDismiss,
  dismissable = true,
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();

  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.95);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Portal>
      <View style={StyleSheet.absoluteFill}>
        <TouchableWithoutFeedback onPress={dismissable ? onDismiss : undefined}>
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.4)",
              opacity,
            }}
          />
        </TouchableWithoutFeedback>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: tokens.spacing.lg,
          }}
        >
          <Animated.View
            style={{
              transform: [{ scale }],
              width: "100%",
              maxWidth: 420,
            }}
          >
            <Surface
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: tokens.radii.xl,
                paddingVertical: tokens.spacing.md,
                paddingHorizontal: tokens.spacing.lg,
              }}
            >
              {content}
            </Surface>
          </Animated.View>
        </View>
      </View>
    </Portal>
  );
}
