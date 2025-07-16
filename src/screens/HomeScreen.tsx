import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../state/appStore';
import { ResourceTile } from '../components/ResourceTile';
import { CTAButton } from '../components/CTAButton';
import { Badge } from '../components/Badge';
import { GaitorFAB } from '../components/GaitorFAB';
import { Resource } from '../types';

const quickAccessResources: Resource[] = [
  {
    id: '1',
    title: 'Canvas',
    description: 'Access your assignments and grades',
    category: 'academic',
    icon: 'school-outline',
    color: '#10502f',
    isExternal: true,
  },
  {
    id: '2',
    title: 'Lunch Menu',
    description: 'See this week\'s lunch options',
    category: 'services',
    icon: 'restaurant-outline',
    color: '#ee592b',
  },
  {
    id: '3',
    title: 'Nurse Office',
    description: 'Health services and forms',
    category: 'services',
    icon: 'medical-outline',
    color: '#ee592b',
  },
  {
    id: '4',
    title: 'Absence Form',
    description: 'Report student absence',
    category: 'services',
    icon: 'calendar-clear-outline',
    color: '#ee592b',
  },
];

const newsItems = [
  {
    id: '1',
    title: 'Spring Sports Registration Now Open',
    summary: 'Sign up for baseball, softball, tennis, and track & field by March 15th.',
    priority: 'high' as const,
    publishedAt: new Date(),
  },
  {
    id: '2',
    title: 'Parent-Teacher Conferences',
    summary: 'Schedule your spring conferences online starting next week.',
    priority: 'medium' as const,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { selectedStudent, students, notifications } = useAppStore();

  const currentStudent = selectedStudent || students[0];
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

  const handleResourcePress = (resource: Resource) => {
    navigation.navigate('ResourceDetail' as never, { resource } as never);
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile' as never);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1"
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header Section */}
        <View className="bg-gator-green pt-4 pb-8 px-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">
                {greeting}, Gator Family! 🐊
              </Text>
              {currentStudent && (
                <Text className="text-white/80 text-base mt-1">
                  Viewing: {currentStudent.name} • {currentStudent.grade}
                </Text>
              )}
            </View>
            <Pressable
              onPress={handleProfilePress}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center ml-4"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="person-outline" size={20} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 -mt-4">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </Text>
            <View className="flex-row space-x-3">
              <CTAButton
                title="View Grades"
                icon="school-outline"
                variant="primary"
                size="small"
                onPress={() => handleResourcePress(quickAccessResources[0])}
              />
              <CTAButton
                title="Check Calendar"
                icon="calendar-outline"
                variant="outline"
                size="small"
                onPress={() => navigation.navigate('Calendar' as never)}
              />
            </View>
          </View>
        </View>

        {/* News & Announcements */}
        <View className="px-6 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Latest News
            </Text>
            <Pressable>
              <Text className="text-gator-green font-medium">View All</Text>
            </Pressable>
          </View>
          
          <View className="space-y-3">
            {newsItems.map((item) => (
              <Pressable
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View className="flex-row items-start justify-between mb-2">
                  <Text className="text-base font-semibold text-gray-900 flex-1 mr-3">
                    {item.title}
                  </Text>
                  <Badge
                    text={item.priority === 'high' ? 'Important' : 'News'}
                    variant={item.priority === 'high' ? 'warning' : 'info'}
                    size="small"
                  />
                </View>
                <Text className="text-gray-600 text-sm leading-relaxed">
                  {item.summary}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quick Access Resources */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Quick Access
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {quickAccessResources.map((resource, index) => (
              <View key={resource.id} className="w-[48%] mb-3">
                <ResourceTile
                  resource={resource}
                  onPress={() => handleResourcePress(resource)}
                  size="medium"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Recent Notifications Preview */}
        <View className="px-6 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Recent Updates
            </Text>
            <Pressable onPress={() => navigation.navigate('Notifications' as never)}>
              <Text className="text-gator-green font-medium">View All</Text>
            </Pressable>
          </View>
          
          <View className="space-y-2">
            {notifications.slice(0, 2).map((notification) => (
              <View
                key={notification.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-start">
                  <View className={`w-1 h-12 rounded-full mr-3 ${
                    notification.type === 'urgent' ? 'bg-gator-orange' : 'bg-gator-green'
                  }`} />
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900 mb-1">
                      {notification.title}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {notification.message}
                    </Text>
                  </View>
                  {!notification.read && (
                    <View className="w-3 h-3 bg-gator-orange rounded-full" />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <GaitorFAB />
    </View>
  );
};