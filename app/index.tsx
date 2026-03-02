import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, TextInput, Button, Card, HelperText, useTheme, ActivityIndicator } from 'react-native-paper';
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

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace('/welcome');
    }
  }, [user, isLoading]);

  const handleLogin = async () => {
    const success = await signIn(username.trim(), password);
    if (success) {
      setError(false);
      router.replace('/welcome');
    } else {
      setError(true);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: tokens.spacing.xl,
          }}
        >
          <Card
            mode="elevated"
            style={{
              backgroundColor: theme.colors.surface,
              padding: tokens.spacing.xl,
              borderRadius: tokens.radii.xl,
              elevation: 4,
            }}
          >
            <View style={{ marginBottom: tokens.spacing.xl }}>
              <Text
                variant="headlineMedium"
                style={{
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: tokens.spacing.xs,
                }}
              >
                Welcome Back
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  textAlign: 'center',
                  opacity: 0.6,
                }}
              >
                Sign in to continue
              </Text>
            </View>

            <TextInput
              label="Username"
              mode="outlined"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              left={<TextInput.Icon icon="account-outline" />}
              error={error}
              returnKeyType="next"
            />

            <TextInput
              label="Password"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ marginTop: tokens.spacing.md }}
              left={<TextInput.Icon icon="lock-outline" />}
              error={error}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <HelperText
              type="error"
              visible={error}
              style={{ marginTop: tokens.spacing.xs }}
            >
              Invalid username or password
            </HelperText>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={{
                borderRadius: tokens.radii.lg,
                paddingVertical: 4,
              }}
              contentStyle={{ paddingVertical: 6 }}
              disabled={!username || !password}
            >
              Login
            </Button>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}