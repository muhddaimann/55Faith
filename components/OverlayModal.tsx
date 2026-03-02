import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, ScrollView, Animated } from 'react-native';
import { Surface, useTheme, Portal } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';

type Props = {
  visible: boolean;
  content: React.ReactNode;
  onDismiss: () => void;
  dismissable?: boolean;
};

export function OverlayModal({ visible, content, onDismiss, dismissable = true }: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Portal>
      <Animated.View style={[styles.fullscreen, { opacity }]}>
        <TouchableWithoutFeedback onPress={dismissable ? onDismiss : undefined}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <Surface
                style={[
                  styles.content,
                  { 
                    backgroundColor: theme.colors.surface,
                    borderRadius: tokens.radii.lg,
                    padding: tokens.spacing.lg,
                  }
                ]}
                elevation={5}
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  {content}
                </ScrollView>
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
    maxWidth: 500,
    maxHeight: '80%',
  },
});
