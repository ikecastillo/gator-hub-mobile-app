import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../state/appStore';
import { ChatBubble } from '../components/ChatBubble';
import { CTAButton } from '../components/CTAButton';
import { cn } from '../utils/cn';

const quickSuggestions = [
  "How do I report an absence?",
  "What's for lunch this week?",
  "When are parent-teacher conferences?",
  "How do I access Canvas?",
  "What are the school hours?",
  "How do I contact my child's teacher?",
];

export const AskGaitorScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { chatHistory, addChatMessage, clearChatHistory } = useAppStore();

  const getSimulatedResponse = (message: string): string => {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('lunch') || messageLower.includes('food') || messageLower.includes('menu')) {
      return "This week's lunch menu includes pizza Monday, taco Tuesday, and Mediterranean Wednesday! You can find the full menu and nutrition information in the Food Services section. Would you like me to show you how to check your meal account balance too?";
    }
    
    if (messageLower.includes('absence') || messageLower.includes('absent') || messageLower.includes('sick')) {
      return "To report an absence, you can use the Absence Reporting form in the Resources section. You'll need to provide the student's name, date of absence, and reason. For extended absences, you can also request homework from teachers.";
    }
    
    if (messageLower.includes('canvas') || messageLower.includes('grade') || messageLower.includes('assignment')) {
      return "Canvas is our learning management system where students can view assignments, submit homework, and check grades. Parents can access Canvas through the parent portal. You'll find the Canvas link in our Resources section!";
    }
    
    if (messageLower.includes('contact') || messageLower.includes('teacher') || messageLower.includes('email')) {
      return "You can find all teacher contact information in our Teacher Directory. Most teachers respond to emails within 24 hours. For urgent matters, you can always call the main office at (555) 123-4567.";
    }
    
    if (messageLower.includes('hours') || messageLower.includes('time') || messageLower.includes('schedule')) {
      return "School hours are 8:00 AM to 3:30 PM, Monday through Friday. The main office is open from 7:30 AM to 4:00 PM for any questions or assistance you might need.";
    }
    
    if (messageLower.includes('conference') || messageLower.includes('meeting')) {
      return "Parent-teacher conferences are scheduled online through our parent portal. Spring conferences are coming up March 15-17! You can book 15-minute slots with each of your child's teachers.";
    }
    
    // Default friendly response
    return "Great question! I'm here to help you navigate Gateway College Prep. You can find most information in our Resources section, or feel free to contact our friendly office staff at (555) 123-4567. Is there anything specific about school services I can help you with?";
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    addChatMessage({
      text: message,
      isUser: true,
      timestamp: new Date(),
    });

    setInputText('');
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      // Get simulated response
      const response = getSimulatedResponse(message);
      
      // Determine if we should suggest resources based on the query
      const suggestedResources = getSuggestedResources(message);

      // Add Gaitor's response
      addChatMessage({
        text: response,
        isUser: false,
        timestamp: new Date(),
        suggestedResources: suggestedResources.length > 0 ? suggestedResources : undefined,
      });

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      setIsLoading(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const getSuggestedResources = (query: string): string[] => {
    const queryLower = query.toLowerCase();
    const suggestions: string[] = [];

    if (queryLower.includes('lunch') || queryLower.includes('food') || queryLower.includes('menu')) {
      suggestions.push('Food Services');
    }
    if (queryLower.includes('absence') || queryLower.includes('absent') || queryLower.includes('sick')) {
      suggestions.push('Absence Reporting');
    }
    if (queryLower.includes('canvas') || queryLower.includes('grade') || queryLower.includes('assignment')) {
      suggestions.push('Canvas LMS');
    }
    if (queryLower.includes('nurse') || queryLower.includes('health') || queryLower.includes('medical')) {
      suggestions.push('Nurse Office');
    }
    if (queryLower.includes('contact') || queryLower.includes('teacher') || queryLower.includes('email')) {
      suggestions.push('Teacher Directory');
    }
    if (queryLower.includes('calendar') || queryLower.includes('event') || queryLower.includes('schedule')) {
      suggestions.push('School Calendar');
    }

    return suggestions;
  };

  const handleSuggestionPress = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleResourceSuggestionPress = (resource: string) => {
    // In a real app, this would navigate to the resource
    addChatMessage({
      text: `Great! I've opened the ${resource} resource for you. You can find it in the Resources tab as well.`,
      isUser: false,
      timestamp: new Date(),
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gator-green px-6 py-4" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-gator-orange rounded-full items-center justify-center mr-3">
              <Text className="text-white font-bold text-lg">🐊</Text>
            </View>
            <View>
              <Text className="text-white text-lg font-semibold">Ask Gaitor</Text>
              <Text className="text-white/80 text-sm">Your AI school assistant</Text>
            </View>
          </View>
          {chatHistory.length > 0 && (
            <Pressable
              onPress={clearChatHistory}
              className="p-2"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="trash-outline" size={20} color="#ffffff" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-2 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {chatHistory.length === 0 ? (
          <View className="flex-1 justify-center items-center px-6">
            <View className="bg-white rounded-2xl p-8 items-center shadow-sm border border-gray-100 mb-6">
              <Text className="text-6xl mb-4">🐊</Text>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Howdy, Gator Family!
              </Text>
              <Text className="text-gray-600 text-center leading-relaxed mb-6">
                I'm Gaitor, your friendly AI assistant! I'm here to help you with school questions, 
                find resources, and navigate Gateway College Prep.
              </Text>
              <Text className="text-sm font-medium text-gator-green mb-4">
                Try asking me something like:
              </Text>
            </View>

            {/* Quick Suggestions */}
            <View className="w-full space-y-2">
              {quickSuggestions.map((suggestion, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSuggestionPress(suggestion)}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Text className="text-gator-green font-medium text-center">
                    {suggestion}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View>
            {chatHistory.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                onSuggestionPress={handleResourceSuggestionPress}
              />
            ))}
            {isLoading && (
              <View className="items-start mb-4 px-4">
                <View className="bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200">
                  <Text className="text-gray-600">Gaitor is thinking...</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View className="bg-white border-t border-gray-200 px-4 py-4" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          <View className="flex-row items-end space-x-3">
            <View className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 min-h-[44px] max-h-[100px] justify-center">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask Gaitor anything..."
                placeholderTextColor="#9ca3af"
                className="text-base text-gray-900"
                multiline={true}
                textAlignVertical="center"
                onSubmitEditing={() => {
                  if (!inputText.includes('\n')) {
                    handleSendMessage(inputText);
                  }
                }}
                returnKeyType="send"
                enablesReturnKeyAutomatically={true}
              />
            </View>
            <Pressable
              onPress={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
              className={cn(
                'w-12 h-12 rounded-full items-center justify-center shadow-sm',
                inputText.trim() && !isLoading
                  ? 'bg-gator-green'
                  : 'bg-gray-300'
              )}
              style={({ pressed }) => ({ 
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }] 
              })}
            >
              <Ionicons
                name={isLoading ? "hourglass-outline" : "send"}
                size={20}
                color="#ffffff"
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};