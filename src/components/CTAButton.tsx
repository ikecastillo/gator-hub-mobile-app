import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../utils/cn';

interface CTAButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const baseClasses = 'flex-row items-center justify-center rounded-xl';
  
  const variantClasses = {
    primary: 'bg-gator-green shadow-sm',
    secondary: 'bg-gator-orange shadow-sm',
    outline: 'border-2 border-gator-green bg-transparent',
    ghost: 'bg-transparent'
  };

  const sizeClasses = {
    small: 'px-3 py-2 min-h-[36px]',
    medium: 'px-4 py-3 min-h-[44px]',
    large: 'px-6 py-4 min-h-[52px]'
  };

  const textClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
    outline: 'text-gator-green font-semibold',
    ghost: 'text-gator-green font-medium'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const iconSizes = {
    small: 18,
    medium: 20,
    large: 24
  };

  const iconColor = variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : '#10502f';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50'
      )}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : disabled || loading ? 0.5 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {icon && iconPosition === 'left' && (
        <Ionicons
          name={icon}
          size={iconSizes[size]}
          color={iconColor}
          style={{ marginRight: 8 }}
        />
      )}
      
      <Text className={cn(
        textClasses[variant],
        textSizes[size]
      )}>
        {loading ? 'Loading...' : title}
      </Text>
      
      {icon && iconPosition === 'right' && (
        <Ionicons
          name={icon}
          size={iconSizes[size]}
          color={iconColor}
          style={{ marginLeft: 8 }}
        />
      )}
    </Pressable>
  );
};