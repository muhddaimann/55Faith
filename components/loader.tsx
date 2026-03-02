import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ActivityIndicator, Portal, useTheme, Text } from 'react-native-paper';

type Props = {
  visible: boolean;
  message?: string;
};

export function OverlayLoader({ visible, message }: Props) {
  const theme = useTheme();
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
        <View style={styles.backdrop}>
          <ActivityIndicator size="large" color="white" />
          {message && (
            <Text 
              variant="bodyLarge" 
              style={[styles.message, { color: 'white' }]}
            >
              {message}
            </Text>
          )}
        </View>
      </Animated.View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  message: {
    fontWeight: '500',
    textAlign: 'center',
  },
});
