import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { format } from 'date-fns';
import { useAppStore, Notification } from '../state/appStore';
import { Badge } from '../components/Badge';
import { CTAButton } from '../components/CTAButton';

import { cn } from '../utils/cn';

export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useAppStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'unread') {
      return !notification.read;
    }
    return true;
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'urgent':
        return 'warning-outline';
      case 'event':
        return 'calendar-outline';
      case 'academic':
        return 'school-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'urgent':
        return '#ee592b';
      case 'event':
        return '#8b5cf6';
      case 'academic':
        return '#10502f';
      default:
        return '#3b82f6';
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
    console.log('Notification pressed:', notification.title);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Controls */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-900">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Pressable
              onPress={markAllNotificationsRead}
              className="px-3 py-1.5 bg-gator-green rounded-lg"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-white text-sm font-medium">
                Mark All Read
              </Text>
            </Pressable>
          )}
        </View>

        {/* Filter Tabs */}
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <Pressable
            onPress={() => setSelectedFilter('all')}
            className={cn(
              'flex-1 px-4 py-2 rounded-md items-center',
              selectedFilter === 'all' ? 'bg-white shadow-sm' : ''
            )}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className={cn(
              'font-medium',
              selectedFilter === 'all' ? 'text-gator-green' : 'text-gray-600'
            )}>
              All ({notifications.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedFilter('unread')}
            className={cn(
              'flex-1 px-4 py-2 rounded-md items-center',
              selectedFilter === 'unread' ? 'bg-white shadow-sm' : ''
            )}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className={cn(
              'font-medium',
              selectedFilter === 'unread' ? 'text-gator-green' : 'text-gray-600'
            )}>
              Unread ({unreadCount})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView 
        className="flex-1 px-6 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {filteredNotifications.length > 0 ? (
          <View className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Pressable
                key={notification.id}
                onPress={() => handleNotificationPress(notification)}
                className={cn(
                  'bg-white rounded-xl p-4 shadow-sm border border-gray-100',
                  !notification.read && 'border-l-4 border-l-gator-orange'
                )}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View className="flex-row items-start">
                  {/* Timeline indicator */}
                  <View 
                    className="w-1 h-full absolute left-0 top-0 bottom-0 rounded-r-full"
                    style={{ backgroundColor: getNotificationColor(notification.type) }}
                  />
                  
                  {/* Content */}
                  <View className="flex-1 ml-4">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1 mr-3">
                        <Text className={cn(
                          'text-base mb-1',
                          notification.read ? 'text-gray-700' : 'text-gray-900 font-semibold'
                        )}>
                          {notification.title}
                        </Text>
                        <Text className="text-sm text-gray-600 leading-relaxed">
                          {notification.message}
                        </Text>
                      </View>
                      
                      <View className="items-end">
                        {!notification.read && (
                          <View className="w-3 h-3 bg-gator-orange rounded-full mb-2" />
                        )}
                        <Badge
                          text={notification.type}
                          variant={
                            notification.type === 'urgent' ? 'warning' :
                            notification.type === 'event' ? 'info' :
                            notification.type === 'academic' ? 'success' : 'default'
                          }
                          size="small"
                        />
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons 
                          name={getNotificationIcon(notification.type)} 
                          size={16} 
                          color={getNotificationColor(notification.type)}
                        />
                        <Text className="text-sm text-gray-500 ml-2">
                          {notification.category}
                        </Text>
                      </View>
                      
                      <Text className="text-sm text-gray-500">
                        {format(notification.timestamp, 'MMM d, h:mm a')}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View className="bg-white rounded-xl p-8 items-center mt-8">
            <Ionicons 
              name={selectedFilter === 'unread' ? "checkmark-circle-outline" : "notifications-outline"} 
              size={48} 
              color="#d1d5db" 
            />
            <Text className="text-gray-500 text-lg font-medium mt-4 mb-2">
              {selectedFilter === 'unread' ? 'All caught up!' : 'No notifications'}
            </Text>
            <Text className="text-gray-400 text-center">
              {selectedFilter === 'unread' 
                ? 'You have read all your notifications'
                : 'You don\'t have any notifications yet'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};