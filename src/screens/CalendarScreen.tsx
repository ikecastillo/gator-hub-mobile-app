import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { CalendarEvent } from '../types';
import { Badge } from '../components/Badge';
import { CTAButton } from '../components/CTAButton';
import { cn } from '../utils/cn';
import { useNavigationContext } from '../navigation/NavigationProvider';

// Generate sample events for demo
const generateSampleEvents = (): CalendarEvent[] => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  return [
    // Today's events
    {
      id: '1',
      title: 'Morning Assembly',
      date: new Date(currentYear, currentMonth, today.getDate()),
      startTime: '8:00 AM',
      endTime: '8:30 AM',
      type: 'event',
      location: 'Main Auditorium',
      description: 'Weekly student assembly with announcements',
    },
    {
      id: '2',
      title: 'Math Quiz - Grade 10',
      date: new Date(currentYear, currentMonth, today.getDate()),
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      type: 'academic',
      location: 'Room 204',
      description: 'Chapter 5 quiz on algebraic equations',
    },
    
    // This week
    {
      id: '3',
      title: 'Parent-Teacher Conferences',
      date: new Date(currentYear, currentMonth, today.getDate() + 2),
      startTime: '3:00 PM',
      endTime: '8:00 PM',
      type: 'meeting',
      location: 'All Classrooms',
      description: 'Spring parent-teacher conferences. Sign up online.',
    },
    {
      id: '4',
      title: 'Basketball Game vs Eagles',
      date: new Date(currentYear, currentMonth, today.getDate() + 3),
      startTime: '6:00 PM',
      endTime: '8:00 PM',
      type: 'event',
      location: 'Gymnasium',
      description: 'Home basketball game against Central Eagles',
    },
    {
      id: '5',
      title: 'Science Fair Setup',
      date: new Date(currentYear, currentMonth, today.getDate() + 5),
      startTime: '2:00 PM',
      endTime: '4:00 PM',
      type: 'event',
      location: 'Cafeteria',
      description: 'Students set up their science fair projects',
    },
    
    // Next week
    {
      id: '6',
      title: 'Science Fair Project Due',
      date: new Date(currentYear, currentMonth, today.getDate() + 7),
      startTime: '11:59 PM',
      type: 'deadline',
      description: 'All science fair projects must be submitted',
    },
    {
      id: '7',
      title: 'School Picture Day',
      date: new Date(currentYear, currentMonth, today.getDate() + 9),
      startTime: '9:00 AM',
      endTime: '3:00 PM',
      type: 'event',
      location: 'Library',
      description: 'Individual and class photos',
    },
    {
      id: '8',
      title: 'PTO Meeting',
      date: new Date(currentYear, currentMonth, today.getDate() + 10),
      startTime: '7:00 PM',
      endTime: '8:30 PM',
      type: 'meeting',
      location: 'Conference Room',
      description: 'Monthly Parent-Teacher Organization meeting',
    },
    {
      id: '9',
      title: 'Field Trip - Science Museum',
      date: new Date(currentYear, currentMonth, today.getDate() + 12),
      startTime: '9:00 AM',
      endTime: '3:00 PM',
      type: 'event',
      location: 'Science Museum Downtown',
      description: 'Grade 8 field trip to explore interactive exhibits',
    },
    
    // Later this month
    {
      id: '10',
      title: 'Spring Break Begins',
      date: new Date(currentYear, currentMonth, today.getDate() + 15),
      type: 'event',
      description: 'No school - Spring Break begins',
    },
    {
      id: '11',
      title: 'Book Fair',
      date: new Date(currentYear, currentMonth, today.getDate() + 20),
      startTime: '8:00 AM',
      endTime: '4:00 PM',
      type: 'event',
      location: 'Library',
      description: 'Annual book fair with special author visit',
    },
    {
      id: '12',
      title: 'Drama Club Performance',
      date: new Date(currentYear, currentMonth, today.getDate() + 22),
      startTime: '7:00 PM',
      endTime: '9:00 PM',
      type: 'event',
      location: 'Main Auditorium',
      description: 'Spring musical performance by Drama Club',
    },
    
    // Random dates in current month
    {
      id: '13',
      title: 'Early Dismissal',
      date: new Date(currentYear, currentMonth, 8),
      startTime: '1:00 PM',
      type: 'event',
      description: 'Early dismissal for staff development',
    },
    {
      id: '14',
      title: 'Spelling Bee Finals',
      date: new Date(currentYear, currentMonth, 14),
      startTime: '2:00 PM',
      endTime: '3:30 PM',
      type: 'event',
      location: 'Main Auditorium',
      description: 'School-wide spelling bee competition',
    },
    {
      id: '15',
      title: 'Report Cards Available',
      date: new Date(currentYear, currentMonth, 25),
      type: 'academic',
      description: 'Quarterly report cards available in parent portal',
    },
  ];
};

const mockEvents = generateSampleEvents();

export const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const { isReady: isNavigationReady } = useNavigationContext();

  const currentMonth = startOfMonth(selectedDate);
  const currentMonthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: currentMonth, end: currentMonthEnd });

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => isSameDay(event.date, date));
  };

  const upcomingEvents = mockEvents
    .filter(event => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 10);

  const handleDateSelect = (date: Date) => {
    if (isNavigationReady) {
      setSelectedDate(date);
    }
  };

  const handleViewModeChange = (mode: 'month' | 'agenda') => {
    if (isNavigationReady) {
      setViewMode(mode);
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (isNavigationReady) {
      const newDate = new Date(selectedDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setSelectedDate(newDate);
    }
  };

  const handleTodayPress = () => {
    if (isNavigationReady) {
      setSelectedDate(new Date());
    }
  };

  const renderCalendarDay = (date: Date) => {
    const events = getEventsForDate(date);
    const isSelected = isSameDay(date, selectedDate);
    const isCurrentDay = isToday(date);

    return (
              <Pressable
          key={date.toISOString()}
          onPress={() => safeHandleDateSelect(date)}
          className={cn(
          'w-10 h-10 m-1 rounded-lg items-center justify-center relative',
          isSelected && 'bg-gator-green shadow-sm',
          isCurrentDay && !isSelected && 'bg-gator-orange/20 border border-gator-orange/40',
          events.length > 0 && !isSelected && !isCurrentDay && 'bg-blue-50'
        )}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <Text className={cn(
          'text-sm font-medium',
          isSelected ? 'text-white' : 'text-gray-900',
          isCurrentDay && !isSelected && 'text-gator-orange font-bold'
        )}>
          {format(date, 'd')}
        </Text>
        {events.length > 0 && (
          <View style={{ position: 'absolute', bottom: 2, flexDirection: 'row', gap: 1 }}>
            {events.slice(0, 3).map((_, index) => (
              <View 
                key={index}
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: isSelected ? '#ffffff' : '#10502f'
                }}
              />
            ))}
            {events.length > 3 && (
              <Text style={{
                fontSize: 8,
                marginLeft: 2,
                color: isSelected ? '#ffffff' : '#10502f'
              }}>
                +
              </Text>
            )}
          </View>
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

    const eventTypeIcons = {
      academic: 'school-outline',
      event: 'calendar-outline',
      deadline: 'alarm-outline',
      meeting: 'people-outline',
    };

    const isToday = isSameDay(event.date, new Date());
    const isPast = event.date < new Date() && !isToday;

    return (
      <Pressable
        key={event.id}
        onPress={() => {
          Alert.alert(event.title, event.description || 'No additional details available.');
        }}
        className={cn(
          'bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100',
          isPast && 'opacity-75'
        )}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : isPast ? 0.75 : 1 })}
      >
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-row items-start flex-1">
            <View className={cn(
              'w-10 h-10 rounded-lg items-center justify-center mr-3',
              event.type === 'academic' && 'bg-gator-green/10',
              event.type === 'event' && 'bg-green-100',
              event.type === 'deadline' && 'bg-gator-orange/10',
              event.type === 'meeting' && 'bg-gray-100'
            )}>
              <Ionicons
                name={eventTypeIcons[event.type] as any}
                size={18}
                color={
                  event.type === 'academic' ? '#10502f' :
                  event.type === 'event' ? '#22c55e' :
                  event.type === 'deadline' ? '#ee592b' :
                  '#6b7280'
                }
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900 mb-1">
                {event.title}
              </Text>
              {event.description && (
                <Text className="text-sm text-gray-600 leading-relaxed mb-2">
                  {event.description}
                </Text>
              )}
            </View>
          </View>
          <Badge
            text={event.type}
            variant={eventTypeColors[event.type] as any}
            size="small"
          />
        </View>
        
        <View style={{ gap: 4 }}>
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={14} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-2">
              {isToday ? 'Today' : format(event.date, 'EEEE, MMM d')}
              {isToday && ' 🎯'}
            </Text>
          </View>
          
          {event.startTime && (
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 ml-2">
                {event.startTime}{event.endTime && ` - ${event.endTime}`}
              </Text>
            </View>
          )}

          {event.location && (
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 ml-2">
                {event.location}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  // Show loading state while navigation context is initializing
  if (!isNavigationReady) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <View className="items-center">
          <Ionicons name="calendar-outline" size={48} color="#10502f" />
          <Text className="text-gray-600 text-lg font-medium mt-4">
            Loading Calendar...
          </Text>
          <Text className="text-gray-400 text-sm mt-2 text-center">
            Initializing navigation context
          </Text>
        </View>
      </View>
    );
  }

  // Additional safety check for navigation context
  const safeHandleDateSelect = (date: Date) => {
    try {
      if (isNavigationReady) {
        setSelectedDate(date);
      }
    } catch (error) {
      console.warn('Navigation context error in date selection:', error);
    }
  };

  const safeHandleViewModeChange = (mode: 'month' | 'agenda') => {
    try {
      if (isNavigationReady) {
        setViewMode(mode);
      }
    } catch (error) {
      console.warn('Navigation context error in view mode change:', error);
    }
  };

  const safeHandleMonthChange = (direction: 'prev' | 'next') => {
    try {
      if (isNavigationReady) {
        const newDate = new Date(selectedDate);
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        setSelectedDate(newDate);
      }
    } catch (error) {
      console.warn('Navigation context error in month change:', error);
    }
  };

  const safeHandleTodayPress = () => {
    try {
      if (isNavigationReady) {
        setSelectedDate(new Date());
      }
    } catch (error) {
      console.warn('Navigation context error in today press:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* View Toggle */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => safeHandleMonthChange('prev')}
              className="w-8 h-8 items-center justify-center mr-3"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="chevron-back" size={20} color="#10502f" />
            </Pressable>
            <Text className="text-xl font-bold text-gray-900">
              {format(selectedDate, 'MMMM yyyy')}
            </Text>
            <Pressable
              onPress={() => safeHandleMonthChange('next')}
              className="w-8 h-8 items-center justify-center ml-3"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="chevron-forward" size={20} color="#10502f" />
            </Pressable>
          </View>
          
          <Pressable
            onPress={safeHandleTodayPress}
            className="px-3 py-1.5 bg-gator-green/10 rounded-lg"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className="text-gator-green font-medium text-sm">Today</Text>
          </Pressable>
        </View>
        
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <Pressable
            onPress={() => safeHandleViewModeChange('month')}
            className={cn(
              'flex-1 px-3 py-2 rounded-md items-center',
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
            onPress={() => safeHandleViewModeChange('agenda')}
            className={cn(
              'flex-1 px-3 py-2 rounded-md items-center',
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
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold text-gray-900">
                  {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'MMM d, yyyy')}
                </Text>
                {getEventsForDate(selectedDate).length > 0 && (
                  <Badge
                    text={`${getEventsForDate(selectedDate).length} event${getEventsForDate(selectedDate).length > 1 ? 's' : ''}`}
                    variant="info"
                    size="small"
                  />
                )}
              </View>
              {getEventsForDate(selectedDate).length > 0 ? (
                <View style={{ gap: 8 }}>
                  {getEventsForDate(selectedDate).map(renderEventItem)}
                </View>
              ) : (
                <View className="bg-white rounded-xl p-8 items-center">
                  <Ionicons name="calendar-outline" size={40} color="#d1d5db" />
                  <Text className="text-gray-500 text-base font-medium mt-3 mb-1">
                    No events scheduled
                  </Text>
                  <Text className="text-gray-400 text-sm text-center">
                    {isSameDay(selectedDate, new Date()) ? 
                      'Enjoy your free day!' : 
                      'This day is currently open'
                    }
                  </Text>
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
            {upcomingEvents.length > 0 ? (
              <View style={{ gap: 8 }}>
                {upcomingEvents.map(renderEventItem)}
              </View>
            ) : (
              <View className="bg-white rounded-xl p-8 items-center">
                <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-500 text-lg font-medium mt-4 mb-2">
                  No upcoming events
                </Text>
                <Text className="text-gray-400 text-center">
                  Check back later for new events and activities
                </Text>
              </View>
            )}
          </View>
        )}

        <View className="px-6 pb-6">
          <CTAButton
            title="Subscribe to Calendar"
            icon="add-outline"
            variant="outline"
            fullWidth
            onPress={() => {
              Alert.alert(
                'Calendar Subscription',
                'Calendar subscription feature will be available soon. You\'ll be able to sync school events with your personal calendar app.',
                [{ text: 'OK' }]
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};