import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { Surface, Text, Button, useTheme, Portal } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
};

export function OverlayConfirm({ 
  visible, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel,
  isDestructive = false
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Portal>
      <Animated.View style={[styles.fullscreen, { opacity }]}>
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <Surface
                style={[
                  styles.content,
                  { 
                    backgroundColor: theme.colors.surface,
                    borderRadius: tokens.radii.lg,
                    padding: tokens.spacing.lg,
                    gap: tokens.spacing.md,
                  }
                ]}
                elevation={5}
              >
                {title && (
                  <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                    {title}
                  </Text>
                )}
                {message && (
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    {message}
                  </Text>
                )}
                <View style={styles.actions}>
                  <Button 
                    mode="text" 
                    onPress={onCancel} 
                    style={{ borderRadius: tokens.radii.md }}
                    textColor={theme.colors.onSurfaceVariant}
                  >
                    {cancelText}
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={onConfirm} 
                    style={{ borderRadius: tokens.radii.md }}
                    buttonColor={isDestructive ? theme.colors.error : theme.colors.primary}
                    textColor={isDestructive ? theme.colors.onError : theme.colors.onPrimary}
                  >
                    {confirmText}
                  </Button>
                </View>
              </Surface>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
});
