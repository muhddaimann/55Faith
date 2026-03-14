import React, { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button, Card, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { useDesign } from "../contexts/designContext";
import { useAuth } from "../contexts/authContext";
import { KeyboardLayout } from "../components/keyboardLayout";
import { OverlayLoader } from "../components/loader";
import { OverlayToast } from "../components/toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const theme = useTheme();
  const tokens = useDesign();
  const { signIn, user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace("/welcome");
    }
  }, [user, isLoading]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    setErrorMsg(null);
    setShowToast(false);

    try {
      const response = await signIn(username.trim(), password);
      if (response.status !== "success") {
        const msg = response.message || "Invalid username or password";
        setErrorMsg(msg);
        setShowToast(true);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <KeyboardLayout
      style={{
        justifyContent: "center",
        paddingHorizontal: tokens.spacing.xl,
      }}
    >
      <OverlayLoader
        visible={isLoading || isSigningIn}
        message={isSigningIn ? "Signing in..." : undefined}
      />

      <OverlayToast
        visible={showToast}
        message={errorMsg || ""}
        variant="error"
        onDismiss={() => setShowToast(false)}
      />

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
              fontWeight: "700",
              textAlign: "center",
              marginBottom: tokens.spacing.xs,
            }}
          >
            Welcome Back
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              textAlign: "center",
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
          error={showToast}
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
          error={showToast}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={{
            borderRadius: tokens.radii.lg,
            paddingVertical: 4,
            marginTop: tokens.spacing.xl,
          }}
          contentStyle={{ paddingVertical: 6 }}
          disabled={!username || !password || isSigningIn}
          loading={isSigningIn}
        >
          Login
        </Button>
      </Card>
    </KeyboardLayout>
  );
}
