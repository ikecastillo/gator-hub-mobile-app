import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import React from "react";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

// Error boundary for navigation context issues
class NavigationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // If there's a navigation context error, we'll handle it gracefully
    if (error.message.includes('navigation context') || error.message.includes('NavigationContainer')) {
      return { hasError: true };
    }
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Navigation context error caught:', error);
  }

  render() {
    if (this.state.hasError) {
      // Return a simple fallback UI
      return (
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="light" />
          </NavigationContainer>
        </SafeAreaProvider>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <NavigationErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer
          onReady={() => {
            console.log('Navigation container is ready');
          }}
          onStateChange={(state) => {
            console.log('Navigation state changed:', state?.routes?.map(r => r.name));
          }}
        >
          <AppNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </NavigationErrorBoundary>
  );
}
