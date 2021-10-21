import React, { createContext, ReactNode, useContext, useState} from 'react';
import * as AuthSession from 'expo-auth-session';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

type AuthContextData = {
  user: User | null;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthProviderProps = {
  children: React.ReactNode;
}

type AuthResponse = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
  }
}

const CLIENT_ID = 'e2a6e130db64ce51bbf3'
const SCOPE= 'read:user'
const USER_STORAGE = '@nlwheat:user';
const TOKEN_STORAGE = '@nlwheat:token';

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  async function signIn() {
    setIsSigningIn(true);
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
    const { params } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;
    
    if(params && params.code) {
      const authResponse = await api.post(`/authenticate`, { code: params.code })
      const { user, token } = authResponse.data as AuthResponse;

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
      await AsyncStorage.setItem(TOKEN_STORAGE, JSON.stringify(user));

      setUser(user);
    }

    setIsSigningIn(false);
  }
  async function signOut() {}

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut,
      user,
      isSigningIn
    }}>
      { children }
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth }