import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../state/appStore';
import { cn } from '../utils/cn';

export const GaitorFAB: React.FC = () => {
  const { toggleGaitor, unreadCount } = useAppStore();

  return (
    <View className="absolute bottom-24 right-6 z-50">
      <Pressable
        onPress={toggleGaitor}
        className="bg-gator-orange w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
      >
        <View className="items-center justify-center">
          <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
          <Text className="text-[8px] text-white font-bold mt-0.5">
            GAITOR
          </Text>
        </View>
        
        {unreadCount > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};