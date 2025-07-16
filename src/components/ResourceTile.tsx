import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Resource } from '../types';
import { cn } from '../utils/cn';

interface ResourceTileProps {
  resource: Resource;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const ResourceTile: React.FC<ResourceTileProps> = ({ 
  resource, 
  onPress, 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'h-20 flex-row items-center px-4 py-3',
    medium: 'h-32 p-4',
    large: 'h-40 p-6'
  };

  const iconSizes = {
    small: 20,
    medium: 28,
    large: 32
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden',
        sizeClasses[size]
      )}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View 
        className={cn(
          'absolute inset-0 opacity-5',
          resource.category === 'academic' && 'bg-gator-green',
          resource.category === 'services' && 'bg-gator-orange',
          resource.category === 'communication' && 'bg-blue-500',
          resource.category === 'community' && 'bg-purple-500'
        )}
      />
      
      <View className={size === 'small' ? 'flex-row items-center flex-1' : 'flex-1'}>
        <View className={cn(
          'items-center justify-center rounded-xl',
          size === 'small' ? 'w-12 h-12 mr-3' : 'w-14 h-14 mb-3',
          resource.category === 'academic' && 'bg-gator-green/10',
          resource.category === 'services' && 'bg-gator-orange/10',
          resource.category === 'communication' && 'bg-blue-500/10',
          resource.category === 'community' && 'bg-purple-500/10'
        )}>
          <Ionicons
            name={resource.icon as any}
            size={iconSizes[size]}
            color={
              resource.category === 'academic' ? '#10502f' :
              resource.category === 'services' ? '#ee592b' :
              resource.category === 'communication' ? '#3b82f6' :
              '#8b5cf6'
            }
          />
        </View>
        
        <View className={size === 'small' ? 'flex-1' : ''}>
          <Text className={cn(
            'font-semibold text-gray-900 mb-1',
            textSizes[size]
          )}>
            {resource.title}
          </Text>
          {size !== 'small' && (
            <Text className="text-xs text-gray-600 leading-relaxed">
              {resource.description}
            </Text>
          )}
        </View>
      </View>
      
      {resource.isExternal && size !== 'small' && (
        <View className="absolute top-3 right-3">
          <Ionicons name="open-outline" size={16} color="#6b7280" />
        </View>
      )}
    </Pressable>
  );
};