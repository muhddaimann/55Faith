import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button, Card, HelperText, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useDesign } from '../contexts/designContext';
import { useAuth } from '../contexts/authContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const theme = useTheme();
  const tokens = useDesign();
  const { signIn, user, isLoading } = useAuth();

  // Auto-login check
  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace('/welcome');
    }
  }, [user, isLoading]);

  const handleLogin = async () => {
    const success = await signIn(username, password);
    if (success) {
      setError(false);
      // Redirect to the intermediate welcome screen
      router.replace('/welcome');
    } else {
      setError(true);
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner from Paper
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: tokens.spacing.lg }}>
      <Card style={{ padding: tokens.spacing.lg, borderRadius: tokens.radii.xl }}>
        <Text variant="headlineLarge" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: tokens.spacing.xs }}>App Name</Text>
        <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: tokens.spacing.lg, opacity: 0.6 }}>
          Sign in to your account
        </Text>
        
        <TextInput
          label="Username"
          mode="outlined"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          error={error}
        />
        
        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ marginTop: tokens.spacing.md }}
          error={error}
        />
        
        {error && (
          <HelperText type="error" visible={error}>
            Invalid credentials (user / 123)
          </HelperText>
        )}

        <Button 
          mode="contained" 
          onPress={handleLogin} 
          style={{ marginTop: tokens.spacing.lg }}
        >
          Login
        </Button>
      </Card>
    </View>
  );
}
