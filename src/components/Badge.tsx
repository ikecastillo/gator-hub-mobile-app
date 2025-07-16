import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '../utils/cn';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'medium',
  showDot = false,
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-gator-orange/10 text-gator-orange',
    error: 'bg-red-100 text-red-800',
    info: 'bg-gator-green/10 text-gator-green',
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base',
  };

  const dotColors = {
    default: 'bg-gray-400',
    success: 'bg-green-500',
    warning: 'bg-gator-orange',
    error: 'bg-red-500',
    info: 'bg-gator-green',
  };

  return (
    <View className={cn(
      'flex-row items-center rounded-full',
      variantClasses[variant],
      sizeClasses[size]
    )}>
      {showDot && (
        <View className={cn(
          'w-2 h-2 rounded-full mr-2',
          dotColors[variant]
        )} />
      )}
      <Text className={cn(
        'font-medium',
        variantClasses[variant].split(' ')[1]
      )}>
        {text}
      </Text>
    </View>
  );
};