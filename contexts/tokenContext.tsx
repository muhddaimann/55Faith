import React, { createContext, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_token';

export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to get token', e);
    return null;
  }
};

export const setStoredToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (e) {
    console.error('Failed to save token', e);
  }
};

export const clearStoredToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to delete token', e);
  }
};

type TokenContextType = {
  getToken: () => Promise<string | null>;
  saveToken: (token: string) => Promise<void>;
  deleteToken: () => Promise<void>;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) throw new Error('useToken must be used within a TokenProvider');
  return context;
};

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TokenContext.Provider value={{ getToken, saveToken: setStoredToken, deleteToken: clearStoredToken }}>
      {children}
    </TokenContext.Provider>
  );
};
