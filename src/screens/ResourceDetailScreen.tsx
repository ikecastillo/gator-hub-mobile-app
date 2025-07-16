import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Resource } from '../types';
import { CTAButton } from '../components/CTAButton';
import { Badge } from '../components/Badge';
import { cn } from '../utils/cn';

export const ResourceDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { resource } = route.params as { resource: Resource };

  const getResourceContent = (resource: Resource) => {
    // Mock detailed content based on resource type
    const contentMap: Record<string, any> = {
      'Canvas LMS': {
        description: 'Canvas is our Learning Management System where you can access all your academic materials, submit assignments, view grades, and communicate with teachers.',
        features: [
          'View assignment due dates and requirements',
          'Submit homework and projects online',
          'Check grades and feedback from teachers',
          'Access course materials and resources',
          'Participate in class discussions',
          'Message teachers and classmates',
        ],
        quickLinks: [
          { title: 'Student Login', url: 'https://canvas.gatewayprep.edu' },
          { title: 'Parent Access', url: 'https://canvas.gatewayprep.edu/parent' },
          { title: 'Mobile App Guide', url: '#' },
        ],
        helpInfo: 'Need help with Canvas? Contact the IT Help Desk at helpdesk@gatewayprep.edu or call (555) 123-4570.',
      },
      'Food Services': {
        description: 'Stay informed about our weekly lunch menus, nutrition information, and meal account management.',
        features: [
          'View daily and weekly lunch menus',
          'Check nutritional information and allergen alerts',
          'Manage student meal accounts and payments',
          'Sign up for free/reduced lunch programs',
          'Special dietary accommodation requests',
          'Breakfast program information',
        ],
        quickLinks: [
          { title: 'This Week\'s Menu', url: '#' },
          { title: 'Account Balance', url: '#' },
          { title: 'Nutrition Info', url: '#' },
        ],
        helpInfo: 'Questions about food services? Contact our cafeteria manager at food@gatewayprep.edu or call (555) 123-4571.',
      },
      'Absence Reporting': {
        description: 'Quickly and easily report student absences, tardies, and early dismissals through our online system.',
        features: [
          'Report full-day and partial absences',
          'Submit absence documentation',
          'View attendance history and records',
          'Set up recurring absence notifications',
          'Request homework for extended absences',
          'Early dismissal requests',
        ],
        quickLinks: [
          { title: 'Report Absence', url: '#' },
          { title: 'View Attendance', url: '#' },
          { title: 'Upload Documents', url: '#' },
        ],
        helpInfo: 'For attendance questions, contact the main office at (555) 123-4567 or attendance@gatewayprep.edu.',
      },
    };

    return contentMap[resource.title] || {
      description: resource.description,
      features: ['Access important school resources', 'Stay connected with school updates', 'Manage student information'],
      quickLinks: [],
      helpInfo: 'For more information, contact the school office at (555) 123-4567.',
    };
  };

  const content = getResourceContent(resource);

  const handleLinkPress = (url: string) => {
    // In a real app, this would open the URL
    console.log('Opening:', url);
  };

  const getCategoryColor = (category: Resource['category']) => {
    switch (category) {
      case 'academic':
        return '#10502f';
      case 'services':
        return '#ee592b';
      case 'communication':
        return '#3b82f6';
      case 'community':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Section */}
        <View className="bg-white px-6 py-8 border-b border-gray-200">
          <View className="items-center mb-6">
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
              style={{ backgroundColor: getCategoryColor(resource.category) + '20' }}
            >
              <Ionicons
                name={resource.icon as any}
                size={32}
                color={getCategoryColor(resource.category)}
              />
            </View>
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              {resource.title}
            </Text>
            <Badge 
              text={resource.category} 
              variant="info" 
              size="medium"
            />
          </View>
          
          <Text className="text-gray-700 text-center leading-relaxed mb-6">
            {content.description}
          </Text>

          {resource.isExternal && (
            <View className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <View className="flex-row items-center">
                <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
                <Text className="text-blue-800 font-medium ml-2">External Resource</Text>
              </View>
              <Text className="text-blue-700 text-sm mt-1">
                This resource will open in your web browser or external app.
              </Text>
            </View>
          )}
        </View>

        {/* Features Section */}
        <View className="bg-white px-6 py-6 border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            What you can do:
          </Text>
          <View className="space-y-3">
            {content.features.map((feature: string, index: number) => (
              <View key={index} className="flex-row items-start">
                <View className="w-6 h-6 bg-gator-green/10 rounded-full items-center justify-center mr-3 mt-0.5">
                  <Ionicons name="checkmark" size={14} color="#10502f" />
                </View>
                <Text className="text-gray-700 flex-1">
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Links Section */}
        {content.quickLinks.length > 0 && (
          <View className="bg-white px-6 py-6 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </Text>
            <View className="space-y-3">
              {content.quickLinks.map((link: any, index: number) => (
                <Pressable
                  key={index}
                  onPress={() => handleLinkPress(link.url)}
                  className="flex-row items-center p-3 bg-gray-50 rounded-xl"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Ionicons name="link-outline" size={20} color="#10502f" />
                  <Text className="text-gator-green font-medium ml-3 flex-1">
                    {link.title}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#10502f" />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Help Section */}
        <View className="px-6 py-6">
          <View className="bg-gator-green/5 p-4 rounded-xl border border-gator-green/20">
            <View className="flex-row items-start">
              <Ionicons name="help-circle-outline" size={24} color="#10502f" />
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-gator-green mb-2">
                  Need Help?
                </Text>
                <Text className="text-gray-700 text-sm leading-relaxed">
                  {content.helpInfo}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-6 pb-6">
          <CTAButton
            title={resource.isExternal ? 'Open Resource' : 'Access Now'}
            icon={resource.isExternal ? 'open-outline' : 'arrow-forward'}
            variant="primary"
            fullWidth
            onPress={() => handleLinkPress(resource.url || '#')}
          />
        </View>
      </ScrollView>
    </View>
  );
};