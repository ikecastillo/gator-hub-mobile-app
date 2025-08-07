import React from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppStore } from '../state/appStore';
import { CTAButton } from '../components/CTAButton';
import { Badge } from '../components/Badge';
import { cn } from '../utils/cn';

export const ProfileScreen: React.FC = () => {
  const {
    selectedStudent,
    students,
    setSelectedStudent,
    isDarkMode,
    toggleDarkMode,
    notificationSettings,
    updateNotificationSettings,
  } = useAppStore();

  const handleStudentSelect = (student: typeof students[0]) => {
    setSelectedStudent(student);
  };

  const settingSections = [
    {
      title: 'Notifications',
      items: [
        {
          key: 'general',
          title: 'General Notifications',
          description: 'School announcements and updates',
          value: notificationSettings.general,
          onToggle: (value: boolean) => updateNotificationSettings({ general: value }),
        },
        {
          key: 'urgent',
          title: 'Urgent Alerts',
          description: 'Emergency notifications and closures',
          value: notificationSettings.urgent,
          onToggle: (value: boolean) => updateNotificationSettings({ urgent: value }),
        },
        {
          key: 'events',
          title: 'Events & Activities',
          description: 'Sports, clubs, and school events',
          value: notificationSettings.events,
          onToggle: (value: boolean) => updateNotificationSettings({ events: value }),
        },
        {
          key: 'academic',
          title: 'Academic Updates',
          description: 'Grades, assignments, and academic news',
          value: notificationSettings.academic,
          onToggle: (value: boolean) => updateNotificationSettings({ academic: value }),
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          key: 'darkMode',
          title: 'Dark Mode',
          description: 'Use dark theme throughout the app',
          value: isDarkMode,
          onToggle: toggleDarkMode,
        },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Header */}
        <View className="bg-gator-green px-6 py-8">
          <View className="items-center">
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
              <Ionicons name="person" size={40} color="#ffffff" />
            </View>
            <Text className="text-white text-xl font-bold mb-2">
              Gateway College Prep
            </Text>
            <Text className="text-white/80 text-center">
              Gator Hub Parent Portal
            </Text>
          </View>
        </View>

        {/* Student Selector */}
        <View className="px-6 py-6 bg-white border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Select Student
          </Text>
          <View className="space-y-3">
            {students.map((student) => (
              <Pressable
                key={student.id}
                onPress={() => handleStudentSelect(student)}
                className={cn(
                  'flex-row items-center p-4 rounded-xl border-2',
                  selectedStudent?.id === student.id
                    ? 'border-gator-green bg-gator-green/5'
                    : 'border-gray-200 bg-white'
                )}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View className={cn(
                  'w-12 h-12 rounded-full items-center justify-center mr-4',
                  selectedStudent?.id === student.id
                    ? 'bg-gator-green'
                    : 'bg-gray-100'
                )}>
                  <Text className={cn(
                    'text-lg font-bold',
                    selectedStudent?.id === student.id
                      ? 'text-white'
                      : 'text-gray-600'
                  )}>
                    {student.name.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className={cn(
                    'font-semibold mb-1',
                    selectedStudent?.id === student.id
                      ? 'text-gator-green'
                      : 'text-gray-900'
                  )}>
                    {student.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {student.grade}
                  </Text>
                </View>
                {selectedStudent?.id === student.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#10502f" />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section) => (
          <View key={section.title} className="bg-white mt-6 border-t border-b border-gray-200">
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                {section.title}
              </Text>
            </View>
            
            {section.items.map((item, index) => (
              <View
                key={item.key}
                className={cn(
                  'flex-row items-center px-6 py-4',
                  index < section.items.length - 1 && 'border-b border-gray-100'
                )}
              >
                <View className="flex-1 mr-4">
                  <Text className="text-base font-medium text-gray-900 mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {item.description}
                  </Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: '#e5e7eb', true: '#10502f' }}
                  thumbColor="#ffffff"
                />
              </View>
            ))}
          </View>
        ))}

        {/* Quick Actions */}
        <View className="px-6 py-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </Text>
          <View className="space-y-3">
            <CTAButton
              title="Contact School Office"
              icon="call-outline"
              variant="outline"
              fullWidth
              onPress={() => {
                // Handle phone call
              }}
            />
            <CTAButton
              title="Visit School Website"
              icon="globe-outline"
              variant="outline"
              fullWidth
              onPress={() => {
                // Handle website link
              }}
            />
            <CTAButton
              title="Send Feedback"
              icon="chatbubble-outline"
              variant="ghost"
              fullWidth
              onPress={() => {
                // Handle feedback
              }}
            />
          </View>
        </View>

        {/* App Info */}
        <View className="px-6 py-4 bg-gray-100 mx-6 rounded-xl">
          <View className="items-center">
            <Text className="text-lg font-bold text-gator-green mb-2">
              🐊 Gator Hub
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              Version 1.0.0
            </Text>
            <Text className="text-xs text-gray-500 text-center mt-2">
              Gateway College Preparatory School
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};