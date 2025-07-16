import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage } from '../state/appStore';
import { cn } from '../utils/cn';
import { format } from 'date-fns';

interface ChatBubbleProps {
  message: ChatMessage;
  onSuggestionPress?: (suggestion: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  onSuggestionPress 
}) => {
  return (
    <View className={cn(
      'mb-4 px-4',
      message.isUser ? 'items-end' : 'items-start'
    )}>
      <View className={cn(
        'max-w-[85%] rounded-2xl px-4 py-3',
        message.isUser 
          ? 'bg-gator-green' 
          : 'bg-gray-100 border border-gray-200'
      )}>
        <Text className={cn(
          'text-base leading-relaxed',
          message.isUser ? 'text-white' : 'text-gray-900'
        )}>
          {message.text}
        </Text>
        
        {message.suggestedResources && message.suggestedResources.length > 0 && (
          <View className="mt-3 space-y-2">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Suggested Resources:
            </Text>
            {message.suggestedResources.map((suggestion, index) => (
              <Pressable
                key={index}
                onPress={() => onSuggestionPress?.(suggestion)}
                className="flex-row items-center p-2 bg-white rounded-lg border border-gray-200"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Ionicons 
                  name="document-text-outline" 
                  size={16} 
                  color="#10502f" 
                  style={{ marginRight: 8 }}
                />
                <Text className="text-sm text-gator-green font-medium flex-1">
                  {suggestion}
                </Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color="#10502f" 
                />
              </Pressable>
            ))}
          </View>
        )}
      </View>
      
      <Text className="text-xs text-gray-500 mt-1">
        {format(message.timestamp, 'h:mm a')}
      </Text>
    </View>
  );
};