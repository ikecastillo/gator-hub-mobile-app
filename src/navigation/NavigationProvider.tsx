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
    console.warn('useNavigationContext called outside of NavigationProvider, returning fallback');
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
        console.log('Navigation context initialized successfully');
      }, 200); // Increased delay for reliability

      // Return cleanup function
      return timer;
    } catch (error) {
      console.error('Navigation initialization error:', error);
      setHasError(true);
      setInitializationAttempts(prev => prev + 1);
      
      // Auto-retry up to 3 times
      if (initializationAttempts < 3) {
        setTimeout(() => {
          console.log(`Retrying navigation initialization (attempt ${initializationAttempts + 1})`);
          initializeNavigation();
        }, 1000);
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
      console.log('Navigation container is ready');
      setIsReady(true);
      setHasError(false);
    } catch (error) {
      console.error('Navigation ready handler error:', error);
      setHasError(true);
    }
  }, []);

  const handleStateChange = useCallback((state: any) => {
    try {
      if (state?.routes) {
        console.log('Navigation state changed:', state.routes.map((r: any) => r.name));
      }
    } catch (error) {
      console.warn('Navigation state change handler error:', error);
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