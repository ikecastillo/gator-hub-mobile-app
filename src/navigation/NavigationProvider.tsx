import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';

interface NavigationContextType {
  isReady: boolean;
  isInitialized: boolean;
  hasError: boolean;
  retryInitialization: () => void;
}

const NavigationContext = createContext<NavigationContextType>({ 
  isReady: false,
  isInitialized: false,
  hasError: false,
  retryInitialization: () => {}
});

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    // Return a safe fallback instead of throwing
    if (__DEV__) {
      console.warn('[NavigationProvider] useNavigationContext called outside of provider, returning fallback');
    }
    return { isReady: false, isInitialized: false, hasError: true, retryInitialization: () => {} };
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [initializationAttempts, setInitializationAttempts] = useState(0);

  // Safe initialization with retry logic
  const initializeNavigation = useCallback(() => {
    try {
      setHasError(false);
      
      // Add a small delay to ensure React Navigation is fully ready
      const timer = setTimeout(() => {
        setIsInitialized(true);
        if (__DEV__) {
          console.log('[NavigationProvider] Navigation context initialized successfully');
        }
      }, 200); // Increased delay for reliability

      // Return cleanup function
      return timer;
    } catch (error) {
      if (__DEV__) {
        console.warn('[NavigationProvider] Navigation initialization error:', error);
      }
      setHasError(true);
      setInitializationAttempts(prev => prev + 1);
      
      // Auto-retry up to 3 times
      if (initializationAttempts < 3) {
        if (__DEV__) {
          console.log(`[NavigationProvider] Retrying navigation initialization (attempt ${initializationAttempts + 1})`);
        }
        initializeNavigation();
      }
      return null;
    }
  }, [initializationAttempts]);

  const retryInitialization = useCallback(() => {
    setInitializationAttempts(0);
    setHasError(false);
    setIsReady(false);
    setIsInitialized(false);
    initializeNavigation();
  }, [initializeNavigation]);

  useEffect(() => {
    const timer = initializeNavigation();
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [initializeNavigation]);

  const handleNavigationReady = useCallback(() => {
    try {
      if (__DEV__) {
        console.log('[NavigationProvider] Navigation container is ready');
      }
      setIsReady(true);
      setHasError(false);
    } catch (error) {
      if (__DEV__) {
        console.warn('[NavigationProvider] Navigation ready handler error:', error);
      }
      setHasError(true);
    }
  }, []);

  const handleStateChange = useCallback((state: any) => {
    try {
      if (__DEV__ && state?.routes) {
        console.log('[NavigationProvider] Navigation state changed:', state.routes.map((r: any) => r.name));
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('[NavigationProvider] Navigation state change handler error:', error);
      }
    }
  }, []);

  return (
    <NavigationContainer
      onReady={handleNavigationReady}
      onStateChange={handleStateChange}
    >
      <NavigationContext.Provider value={{ 
        isReady: isReady && isInitialized && !hasError,
        isInitialized,
        hasError,
        retryInitialization
      }}>
        {children}
      </NavigationContext.Provider>
    </NavigationContainer>
  );
}; 