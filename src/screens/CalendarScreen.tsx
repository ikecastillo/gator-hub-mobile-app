import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { CalendarEvent } from '../types';
import { Badge } from '../components/Badge';
import { CTAButton } from '../components/CTAButton';

import { cn } from '../utils/cn';

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Parent-Teacher Conferences',
    date: new Date(2024, 2, 15),
    startTime: '3:00 PM',
    endTime: '8:00 PM',
    type: 'meeting',
    location: 'School Building',
    description: 'Spring parent-teacher conferences. Sign up online.',
  },
  {
    id: '2',
    title: 'Spring Break',
    date: new Date(2024, 2, 25),
    type: 'event',
    description: 'No school - Spring Break begins',
  },
  {
    id: '3',
    title: 'Science Fair Project Due',
    date: new Date(2024, 2, 20),
    type: 'deadline',
    description: 'All science fair projects must be submitted by 11:59 PM',
  },
  {
    id: '4',
    title: 'Basketball Game vs Eagles',
    date: new Date(2024, 2, 18),
    startTime: '6:00 PM',
    type: 'event',
    location: 'Gymnasium',
    description: 'Home basketball game against Central Eagles',
  },
];

export const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');

  const currentMonth = startOfMonth(selectedDate);
  const currentMonthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: currentMonth, end: currentMonthEnd });

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => isSameDay(event.date, date));
  };

  const upcomingEvents = mockEvents
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const renderCalendarDay = (date: Date) => {
    const events = getEventsForDate(date);
    const isSelected = isSameDay(date, selectedDate);
    const isCurrentDay = isToday(date);

    return (
      <Pressable
        key={date.toISOString()}
        onPress={() => setSelectedDate(date)}
        className={cn(
          'w-10 h-10 m-1 rounded-lg items-center justify-center',
          isSelected && 'bg-gator-green',
          isCurrentDay && !isSelected && 'bg-gator-orange/20',
          events.length > 0 && !isSelected && 'bg-blue-100'
        )}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text className={cn(
          'text-sm font-medium',
          isSelected ? 'text-white' : 'text-gray-900',
          isCurrentDay && !isSelected && 'text-gator-orange font-bold'
        )}>
          {format(date, 'd')}
        </Text>
        {events.length > 0 && !isSelected && (
          <View className="absolute bottom-0 w-1 h-1 bg-gator-green rounded-full" />
        )}
      </Pressable>
    );
  };

  const renderEventItem = (event: CalendarEvent) => {
    const eventTypeColors = {
      academic: 'info',
      event: 'success',
      deadline: 'warning',
      meeting: 'default',
    };

    return (
      <View
        key={event.id}
        className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
      >
        <View className="flex-row items-start justify-between mb-2">
          <Text className="text-base font-semibold text-gray-900 flex-1 mr-3">
            {event.title}
          </Text>
          <Badge
            text={event.type}
            variant={eventTypeColors[event.type] as any}
            size="small"
          />
        </View>
        
        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-2">
            {format(event.date, 'MMM d, yyyy')}
          </Text>
          {event.startTime && (
            <>
              <Ionicons name="time-outline" size={16} color="#6b7280" style={{ marginLeft: 12 }} />
              <Text className="text-sm text-gray-600 ml-2">
                {event.startTime}{event.endTime && ` - ${event.endTime}`}
              </Text>
            </>
          )}
        </View>

        {event.location && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-2">
              {event.location}
            </Text>
          </View>
        )}

        {event.description && (
          <Text className="text-sm text-gray-700 leading-relaxed">
            {event.description}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* View Toggle */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900">
            {format(selectedDate, 'MMMM yyyy')}
          </Text>
          <View className="flex-row bg-gray-100 rounded-lg p-1">
            <Pressable
              onPress={() => setViewMode('month')}
              className={cn(
                'px-3 py-1.5 rounded-md',
                viewMode === 'month' ? 'bg-white shadow-sm' : ''
              )}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className={cn(
                'text-sm font-medium',
                viewMode === 'month' ? 'text-gator-green' : 'text-gray-600'
              )}>
                Month
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setViewMode('agenda')}
              className={cn(
                'px-3 py-1.5 rounded-md',
                viewMode === 'agenda' ? 'bg-white shadow-sm' : ''
              )}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className={cn(
                'text-sm font-medium',
                viewMode === 'agenda' ? 'text-gator-green' : 'text-gray-600'
              )}>
                Agenda
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {viewMode === 'month' ? (
          <>
            {/* Calendar Grid */}
            <View className="bg-white px-4 py-6">
              {/* Week Headers */}
              <View className="flex-row justify-center mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <View key={index} className="w-10 h-6 items-center justify-center mx-1">
                    <Text className="text-xs font-medium text-gray-500">{day}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar Days */}
              <View className="flex-row flex-wrap justify-center">
                {daysInMonth.map(renderCalendarDay)}
              </View>
            </View>

            {/* Selected Date Events */}
            <View className="px-6 py-4">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Events on {format(selectedDate, 'MMM d, yyyy')}
              </Text>
              {getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map(renderEventItem)
              ) : (
                <View className="bg-white rounded-xl p-6 items-center">
                  <Ionicons name="calendar-outline" size={40} color="#d1d5db" />
                  <Text className="text-gray-500 mt-2">No events scheduled</Text>
                </View>
              )}
            </View>
          </>
        ) : (
          /* Agenda View */
          <View className="px-6 py-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Events
            </Text>
            {upcomingEvents.map(renderEventItem)}
          </View>
        )}

        <View className="px-6 pb-6">
          <CTAButton
            title="Subscribe to Calendar"
            icon="add-outline"
            variant="outline"
            fullWidth
            onPress={() => {
              // Handle calendar subscription
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};