import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { NavigationProvider } from "./src/navigation/NavigationProvider";
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

// Enhanced error boundary for navigation and app-wide issues
class NavigationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage?: string; retryCount: number }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Navigation Error Boundary caught error:', error);
    
    // Handle various types of navigation errors
    const isNavigationError = error.message.includes('navigation context') ||
                              error.message.includes('NavigationContainer') ||
                              error.message.includes('useNavigationState') ||
                              error.message.includes('Screen');
    
    if (isNavigationError) {
      return { hasError: true, errorMessage: error.message };
    }
    
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Navigation Error Boundary - Error Details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // Log additional context for debugging
    if (error.message.includes('navigation context')) {
      console.warn('Navigation context error - This usually indicates timing issues with navigation initialization');
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      errorMessage: undefined,
      retryCount: prevState.retryCount + 1
    }));
  }

  render() {
    if (this.state.hasError) {
      // Enhanced fallback UI with retry capability
      return (
        <SafeAreaProvider>
          <NavigationProvider>
            <AppNavigator />
            <StatusBar style="light" />
          </NavigationProvider>
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
        <NavigationProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </NavigationProvider>
      </SafeAreaProvider>
    </NavigationErrorBoundary>
  );
}
