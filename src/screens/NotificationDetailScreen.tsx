import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { Notification } from '../state/appStore';
import { Badge } from '../components/Badge';
import { CTAButton } from '../components/CTAButton';

export const NotificationDetailScreen: React.FC = () => {
  const route = useRoute();
  const { notification } = route.params as { notification: Notification };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'urgent':
        return 'warning';
      case 'event':
        return 'calendar';
      case 'academic':
        return 'school';
      default:
        return 'information-circle';
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

  const getDetailedContent = (notification: Notification) => {
    // Mock detailed content based on notification
    const contentMap: Record<string, string> = {
      'Parent-Teacher Conferences': `
We're excited to announce that spring parent-teacher conferences are now available for scheduling!

**When:** March 15-17, 2024
**Time:** 3:00 PM - 8:00 PM daily
**Location:** Individual classrooms

**How to Schedule:**
1. Log into the parent portal
2. Select your student
3. Choose available time slots with each teacher
4. Confirm your appointments

**What to Expect:**
- 15-minute sessions with each teacher
- Discussion of academic progress and goals
- Review of upcoming projects and assignments
- Opportunity to address any concerns

**Preparation Tips:**
- Review your student's recent grades and assignments
- Prepare any questions about curriculum or classroom expectations
- Bring a notepad to jot down important information

We look forward to meeting with you to discuss your child's progress and success at Gateway College Prep!

If you have any questions about scheduling or need technical assistance, please contact the main office at (555) 123-4567.
      `,
      'Lunch Menu Update': `
We have some exciting updates to our lunch program this week!

**New Menu Items:**
- Fresh Mediterranean wraps with hummus and vegetables
- Grilled chicken Caesar salad bowls
- Vegetarian chili with cornbread
- Seasonal fruit parfaits with granola

**This Week's Schedule:**
- Monday: Pizza Monday with whole wheat crust options
- Tuesday: Taco Tuesday with black bean alternatives
- Wednesday: Mediterranean Wednesday (new!)
- Thursday: Comfort Food Thursday - mac and cheese
- Friday: Fresh Friday - salad bar and wraps

**Allergen Information:**
All new menu items are clearly labeled with allergen information. Students with dietary restrictions should speak with our cafeteria staff.

**Payment Reminders:**
- Lunch accounts can be managed online through the parent portal
- Low balance alerts are sent when accounts reach $10
- Free and reduced lunch applications are available in the main office

For nutrition information or dietary accommodations, contact our food service coordinator at food@gatewayprep.edu.
      `,
      'School Closure Alert': `
**IMPORTANT WEATHER UPDATE**

Due to the severe weather conditions forecasted for tomorrow, Gateway College Preparatory School will dismiss early.

**Early Dismissal Schedule:**
- High School (Grades 9-12): 1:00 PM
- Middle School (Grades 6-8): 1:15 PM
- Elementary (Grades K-5): 1:30 PM

**Transportation Changes:**
- All bus routes will run on the early dismissal schedule
- After-school activities and sports practices are CANCELLED
- Extended day programs are CANCELLED

**Safety Measures:**
- All exterior doors will be secured by 2:00 PM
- Custodial staff will treat walkways and parking areas
- Emergency contact information should be up to date

**Communication:**
- Additional updates will be sent via SchoolMessenger
- Check our website and social media for the latest information
- Local news stations will be notified of our early dismissal

**Important Reminders:**
- Ensure your child has appropriate weather gear
- Arrange early pickup if needed
- Update emergency contacts if they have changed

Stay safe, Gator families! We will resume normal operations once weather conditions improve.

For questions, contact the main office at (555) 123-4567.
      `,
    };

    return contentMap[notification.title] || `
${notification.message}

For more information about this notification, please contact the school office at (555) 123-4567 or visit our website at www.gatewayprep.edu.

Thank you,
Gateway College Preparatory School Administration
    `;
  };

  const detailedContent = getDetailedContent(notification);

  const getBadgeVariant = (type: Notification['type']) => {
    switch (type) {
      case 'urgent':
        return 'warning';
      case 'event':
        return 'info';
      case 'academic':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="bg-white px-6 py-6 border-b border-gray-200">
          <View className="flex-row items-start mb-4">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: getNotificationColor(notification.type) + '20' }}
            >
              <Ionicons
                name={getNotificationIcon(notification.type)}
                size={24}
                color={getNotificationColor(notification.type)}
              />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-2">
                {notification.title}
              </Text>
              <View className="flex-row items-center space-x-3">
                <Badge 
                  text={notification.type} 
                  variant={getBadgeVariant(notification.type) as any}
                  size="small"
                />
                <Text className="text-sm text-gray-500">
                  {notification.category}
                </Text>
              </View>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-2">
              {format(notification.timestamp, 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="bg-white px-6 py-6">
          <Text className="text-gray-800 leading-relaxed text-base">
            {detailedContent.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') return null;
              
              // Handle bold text
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <Text key={index} className="font-bold text-gray-900 mt-4 mb-2">
                    {paragraph.replace(/\*\*/g, '')}
                  </Text>
                );
              }
              
              // Handle bullet points
              if (paragraph.trim().startsWith('- ')) {
                return (
                  <View key={index} className="flex-row items-start mt-1">
                    <Text className="text-gator-green mr-2">•</Text>
                    <Text className="flex-1 text-gray-700">
                      {paragraph.replace('- ', '')}
                    </Text>
                  </View>
                );
              }
              
              return (
                <Text key={index} className="text-gray-700 mb-3">
                  {paragraph}
                </Text>
              );
            })}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="px-6 py-6 space-y-3">
          {notification.type === 'event' && (
            <CTAButton
              title="Add to Calendar"
              icon="calendar-outline"
              variant="primary"
              fullWidth
              onPress={() => {
                // Handle calendar addition
              }}
            />
          )}
          
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
            variant="ghost"
            fullWidth
            onPress={() => {
              // Handle website visit
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};