import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

interface NavigationContextType {
  isReady: boolean;
}

const NavigationContext = createContext<NavigationContextType>({ isReady: false });

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <NavigationContainer
      onReady={() => {
        console.log('Navigation container is ready');
        setIsReady(true);
      }}
      onStateChange={(state) => {
        console.log('Navigation state changed:', state?.routes?.map(r => r.name));
      }}
    >
      <NavigationContext.Provider value={{ isReady }}>
        {children}
      </NavigationContext.Provider>
    </NavigationContainer>
  );
}; 