import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useDesign } from '../contexts/designContext';

export default function Goodbye() {
  const theme = useTheme();
  const tokens = useDesign();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: tokens.spacing.lg }}>
      <Card style={{ padding: tokens.spacing.lg, borderRadius: tokens.radii.xl }}>
        <Text variant="headlineLarge" style={{ fontWeight: 'bold', textAlign: 'center' }}>Goodbye!</Text>
        <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: tokens.spacing.md, opacity: 0.7 }}>
          You have successfully logged out.
        </Text>
      </Card>
    </View>
  );
}
