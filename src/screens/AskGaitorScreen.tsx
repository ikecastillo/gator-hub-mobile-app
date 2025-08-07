import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../state/appStore';
import { cn } from '../utils/cn';
import { format } from 'date-fns';

const quickSuggestions = [
  { text: "How do I report an absence?", icon: "calendar-clear-outline" },
  { text: "What's for lunch this week?", icon: "restaurant-outline" },
  { text: "When are parent-teacher conferences?", icon: "people-outline" },
  { text: "How do I access Canvas?", icon: "school-outline" },
  { text: "What are the school hours?", icon: "time-outline" },
  { text: "How do I contact my child's teacher?", icon: "mail-outline" },
];

const welcomeMessages = [
  "Howdy, Gator Family! 🐊",
  "G'day from your friendly Gaitor! 🌟",
  "Ready to help you navigate school life! 📚",
  "What can I help you with today? 💚",
];

export const AskGaitorScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { chatHistory, addChatMessage, clearChatHistory } = useAppStore();

  const getSimulatedResponse = (message: string): { text: string; suggestions?: string[] } => {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('lunch') || messageLower.includes('food') || messageLower.includes('menu')) {
      return {
        text: "🍕 This week's lunch menu looks delicious! We have Pizza Monday, Taco Tuesday, and our new Mediterranean Wednesday. All meals include fresh fruits and vegetables.\n\nYou can check your meal account balance anytime through the parent portal. Need help setting up meal payments?",
        suggestions: ['Food Services', 'Meal Account Balance']
      };
    }
    
    if (messageLower.includes('absence') || messageLower.includes('absent') || messageLower.includes('sick')) {
      return {
        text: "📋 No worries! To report an absence, just fill out our quick online form. You'll need your student's name, date, and reason for absence.\n\nFor extended absences (3+ days), I can help you connect with teachers to get homework assignments ahead of time.",
        suggestions: ['Absence Form', 'Teacher Directory']
      };
    }
    
    if (messageLower.includes('canvas') || messageLower.includes('grade') || messageLower.includes('assignment')) {
      return {
        text: "📚 Canvas is your one-stop shop for all things academic! Students can view assignments, submit work, and check grades. Parents get access through the parent portal.\n\nFirst time logging in? I can walk you through the setup process!",
        suggestions: ['Canvas Login', 'Parent Portal Guide']
      };
    }
    
    if (messageLower.includes('contact') || messageLower.includes('teacher') || messageLower.includes('email')) {
      return {
        text: "📞 Our teachers are super responsive! You can find all their contact info in our Teacher Directory. Most reply to emails within 24 hours during school days.\n\nFor urgent matters, the main office is always here to help at (555) 123-4567.",
        suggestions: ['Teacher Directory', 'Main Office']
      };
    }
    
    if (messageLower.includes('hours') || messageLower.includes('time') || messageLower.includes('schedule')) {
      return {
        text: "🕒 Gateway College Prep is open Monday-Friday, 8:00 AM to 3:30 PM. Our main office is available from 7:30 AM to 4:00 PM for any questions.\n\nLooking for after-school program hours or special event times?",
        suggestions: ['School Calendar', 'After School Programs']
      };
    }
    
    if (messageLower.includes('conference') || messageLower.includes('meeting') || messageLower.includes('parent')) {
      return {
        text: "👥 Parent-teacher conferences are coming up March 15-17! You can schedule 15-minute sessions with each teacher through our online booking system.\n\nPro tip: Book early for the best time slots!",
        suggestions: ['Conference Booking', 'Teacher Schedules']
      };
    }
    
    if (messageLower.includes('transportation') || messageLower.includes('bus')) {
      return {
        text: "🚌 Our transportation team keeps everything running smoothly! You can find bus routes, schedules, and real-time updates in the Transportation section.\n\nNeed to report a bus issue or request a route change?",
        suggestions: ['Bus Routes', 'Transportation Contact']
      };
    }
    
    if (messageLower.includes('volunteer') || messageLower.includes('help') || messageLower.includes('pto')) {
      return {
        text: "❤️ We love our volunteer families! The PTO has tons of opportunities to get involved - from classroom help to special events.\n\nEvery bit of help makes our Gator community stronger!",
        suggestions: ['Volunteer Opportunities', 'PTO Events']
      };
    }
    
    // Default friendly response
    return {
      text: "🐊 Great question! I'm here to help make your Gateway College Prep experience smooth and easy. Feel free to explore our Resources section or contact our amazing office team at (555) 123-4567.\n\nWhat else would you like to know about our Gator family?",
      suggestions: ['Browse Resources', 'Contact Office']
    };
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
    setIsTyping(true);

    // Scroll to bottom immediately after user message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate realistic typing delay
    const typingDelay = 1200 + Math.random() * 800; // 1.2-2 seconds
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Get simulated response
      const response = getSimulatedResponse(message);

      // Add Gaitor's response
      addChatMessage({
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        suggestedResources: response.suggestions,
      });

      // Scroll to bottom after response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      setIsLoading(false);
    }, typingDelay);
  };



  const handleSuggestionPress = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleResourceSuggestionPress = (resource: string) => {
    // In a real app, this would navigate to the resource
    addChatMessage({
      text: `Perfect! I've highlighted the ${resource} section for you. You can also find it anytime in the Resources tab. Anything else I can help you with? 😊`,
      isUser: false,
      timestamp: new Date(),
    });
  };

  const TypingIndicator = () => (
    <View className="items-start mb-4 px-4">
      <View className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex-row items-center">
        <View className="w-8 h-8 bg-gator-orange rounded-full items-center justify-center mr-3">
          <Text className="text-white text-xs font-bold">🐊</Text>
        </View>
        <View className="flex-row space-x-1">
          <Animated.View className="w-2 h-2 bg-gray-400 rounded-full" style={{
            opacity: fadeAnim,
            transform: [{ 
              scale: fadeAnim.interpolate({
                inputRange: [0.5, 1],
                outputRange: [0.8, 1.2]
              })
            }]
          }} />
          <Animated.View className="w-2 h-2 bg-gray-400 rounded-full" style={{
            opacity: fadeAnim,
            transform: [{ 
              scale: fadeAnim.interpolate({
                inputRange: [0.5, 1],
                outputRange: [1.2, 0.8]
              })
            }]
          }} />
          <Animated.View className="w-2 h-2 bg-gray-400 rounded-full" style={{
            opacity: fadeAnim,
            transform: [{ 
              scale: fadeAnim.interpolate({
                inputRange: [0.5, 1],
                outputRange: [0.8, 1.2]
              })
            }]
          }} />
        </View>
      </View>
    </View>
  );

  const MessageBubble = ({ message, onSuggestionPress }: { 
    message: any, 
    onSuggestionPress?: (suggestion: string) => void 
  }) => (
    <View className={cn(
      'mb-4 px-4',
      message.isUser ? 'items-end' : 'items-start'
    )}>
      <View className={cn(
        'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm',
        message.isUser 
          ? 'bg-gator-green' 
          : 'bg-white border border-gray-100'
      )}>
        {!message.isUser && (
          <View className="flex-row items-center mb-2">
            <View className="w-6 h-6 bg-gator-orange rounded-full items-center justify-center mr-2">
              <Text className="text-white text-xs font-bold">🐊</Text>
            </View>
            <Text className="text-gator-green font-semibold text-sm">Gaitor</Text>
          </View>
        )}
        
        <Text className={cn(
          'text-base leading-relaxed',
          message.isUser ? 'text-white' : 'text-gray-900'
        )}>
          {message.text}
        </Text>
        
        {message.suggestedResources && message.suggestedResources.length > 0 && (
          <View className="mt-3 space-y-2">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Quick Links:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {message.suggestedResources.map((suggestion: string, index: number) => (
                <Pressable
                  key={index}
                  onPress={() => onSuggestionPress?.(suggestion)}
                  className="bg-gator-green/10 px-3 py-2 rounded-lg border border-gator-green/20"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Text className="text-gator-green font-medium text-sm">
                    {suggestion}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
      
      <Text className="text-xs text-gray-500 mt-1 ml-2">
        {format(message.timestamp, 'h:mm a')}
      </Text>
    </View>
  );

  useEffect(() => {
    if (isTyping) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      
      return () => pulse.stop();
    }
  }, [isTyping]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header - only show when there are chat messages */}
      {chatHistory.length > 0 && (
        <View className="bg-white shadow-sm border-b border-gray-100" style={{ paddingTop: insets.top + 8 }}>
          <View className="px-6 py-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gator-green rounded-xl items-center justify-center mr-3">
                  <Text className="text-white font-bold text-base">🐊</Text>
                </View>
                <View>
                  <Text className="text-gray-900 text-lg font-bold">Gaitor</Text>
                  <Text className="text-gator-green text-xs font-medium">Online now</Text>
                </View>
              </View>
              <Pressable
                onPress={clearChatHistory}
                className="w-9 h-9 bg-gray-100 rounded-lg items-center justify-center"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Ionicons name="refresh-outline" size={16} color="#6b7280" />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-0"
        style={{ paddingTop: chatHistory.length === 0 ? insets.top + 20 : 16 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: 80,
          flexGrow: chatHistory.length === 0 ? 1 : undefined
        }}
        keyboardShouldPersistTaps="handled"
      >
        {chatHistory.length === 0 ? (
          <View className="flex-1 items-center px-6 py-8 justify-center">
            {/* Welcome Card */}
            <View className="bg-white rounded-3xl p-8 items-center shadow-sm border border-gray-100 mb-8 w-full">
              <View className="w-20 h-20 bg-gator-orange rounded-3xl items-center justify-center mb-6 shadow-lg">
                <Text className="text-white font-bold text-3xl">🐊</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
                What can I help you with today? 💚
              </Text>
              <Text className="text-gray-600 text-center leading-relaxed mb-6 text-base">
                I'm your personal guide to Gateway College Prep! Ask me anything about school services, 
                schedules, resources, or how to get things done.
              </Text>
              <View className="bg-gator-green/10 px-4 py-2 rounded-full">
                <Text className="text-gator-green font-semibold text-sm">
                  ✨ Try one of these popular questions
                </Text>
              </View>
            </View>

            {/* Quick Suggestions Grid */}
            <View className="w-full space-y-3">
              {quickSuggestions.map((suggestion, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSuggestionPress(suggestion.text)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center"
                  style={({ pressed }) => ({ 
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }]
                  })}
                >
                  <View className="w-10 h-10 bg-gator-green/10 rounded-xl items-center justify-center mr-3">
                    <Ionicons name={suggestion.icon as any} size={18} color="#10502f" />
                  </View>
                  <Text className="text-gray-700 font-medium flex-1">
                    {suggestion.text}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View>
            {chatHistory.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onSuggestionPress={handleResourceSuggestionPress}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </View>
        )}
      </ScrollView>

      {/* Input Area - Fixed positioning */}
      <View className="absolute bottom-0 left-0 right-0">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View 
            className="bg-white border-t border-gray-100 px-4 py-4" 
            style={{ paddingBottom: Math.max(insets.bottom + 16, 20) }}
          >
            <View className="flex-row items-end space-x-3">
              <View className="flex-1">
                <View className="bg-gray-50 rounded-2xl px-4 py-3 min-h-[48px] max-h-[100px] border border-gray-200">
                  <TextInput
                    ref={inputRef}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Message Gaitor..."
                    placeholderTextColor="#9ca3af"
                    className="text-base text-gray-900 leading-relaxed"
                    multiline={true}
                    textAlignVertical="top"
                    onSubmitEditing={() => {
                      if (!inputText.includes('\n')) {
                        handleSendMessage(inputText);
                      }
                    }}
                    returnKeyType="send"
                    enablesReturnKeyAutomatically={true}
                  />
                </View>
              </View>
              <Pressable
                onPress={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className={cn(
                  'w-12 h-12 rounded-2xl items-center justify-center shadow-sm',
                  inputText.trim() && !isLoading
                    ? 'bg-gator-green'
                    : 'bg-gray-200'
                )}
                style={({ pressed }) => ({ 
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }] 
                })}
              >
                <Ionicons
                  name={isLoading ? "hourglass-outline" : "send"}
                  size={20}
                  color={inputText.trim() && !isLoading ? "#ffffff" : "#9ca3af"}
                />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};