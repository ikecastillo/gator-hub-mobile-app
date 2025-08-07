import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../state/appStore';
import { useNavigationContext } from './NavigationProvider';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ResourcesScreen } from '../screens/ResourcesScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AskGaitorScreen } from '../screens/AskGaitorScreen';
import { ResourceDetailScreen } from '../screens/ResourceDetailScreen';
import { NotificationDetailScreen } from '../screens/NotificationDetailScreen';

const MainTabs = () => {
  const { unreadCount } = useAppStore();
  const { isReady, isInitialized } = useNavigationContext();

  // Create navigators inside component to ensure navigation context is available
  const Tab = createBottomTabNavigator();

  // Show loading state until navigation is fully ready
  if (!isReady || !isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <Ionicons name="home-outline" size={48} color="#10502f" />
        <Text style={{ fontSize: 18, color: '#10502f', marginTop: 16, marginBottom: 8 }}>Loading Gator Hub...</Text>
        <Text style={{ fontSize: 14, color: '#6b7280' }}>
          {!isInitialized ? 'Initializing...' : 'Setting up navigation...'}
        </Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Resources') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Ask Gaitor') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10502f',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          paddingTop: 8,
          paddingBottom: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#10502f',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Gator Hub',
          headerLargeTitle: true,
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{
          title: 'Calendar',
        }}
      />
      <Tab.Screen 
        name="Resources" 
        component={ResourcesScreen}
        options={{
          title: 'Resources',
        }}
      />
      <Tab.Screen 
        name="Ask Gaitor" 
        component={AskGaitorScreen}
        options={{
          title: 'Ask Gaitor',
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarBadge: unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount) : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#ee592b',
            color: '#ffffff',
            fontSize: 11,
            fontWeight: 'bold',
          },
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isReady, isInitialized } = useNavigationContext();
  
  // Create navigator inside component to ensure navigation context is available
  const Stack = createNativeStackNavigator();

  // Show loading state until navigation is fully ready
  if (!isReady || !isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <Ionicons name="apps-outline" size={48} color="#10502f" />
        <Text style={{ fontSize: 18, color: '#10502f', marginTop: 16, marginBottom: 8 }}>Loading App...</Text>
        <Text style={{ fontSize: 14, color: '#6b7280' }}>
          {!isInitialized ? 'Initializing...' : 'Setting up navigation...'}
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#10502f',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ResourceDetail" 
        component={ResourceDetailScreen}
        options={{
          title: 'Resource Details',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="NotificationDetail" 
        component={NotificationDetailScreen}
        options={{
          title: 'Notification',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile & Settings',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};