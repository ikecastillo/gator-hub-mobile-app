import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ResourceTile } from '../components/ResourceTile';
import { Badge } from '../components/Badge';
import { GaitorFAB } from '../components/GaitorFAB';
import { Resource, ResourceCategory } from '../types';
import { cn } from '../utils/cn';

const resourceCategories: ResourceCategory[] = [
  { id: 'all', name: 'All', icon: 'grid-outline', color: '#6b7280' },
  { id: 'academic', name: 'Academic', icon: 'school-outline', color: '#10502f' },
  { id: 'services', name: 'Services', icon: 'business-outline', color: '#ee592b' },
  { id: 'communication', name: 'Communication', icon: 'chatbubbles-outline', color: '#3b82f6' },
  { id: 'community', name: 'Community', icon: 'people-outline', color: '#8b5cf6' },
];

const allResources: Resource[] = [
  // Academic
  {
    id: '1',
    title: 'Canvas LMS',
    description: 'Access assignments, grades, and course materials',
    category: 'academic',
    icon: 'school-outline',
    color: '#10502f',
    isExternal: true,
  },
  {
    id: '2',
    title: 'Student Handbook',
    description: 'School policies, procedures, and important information',
    category: 'academic',
    icon: 'book-outline',
    color: '#10502f',
  },
  {
    id: '3',
    title: 'Library Resources',
    description: 'Online catalog, digital resources, and research tools',
    category: 'academic',
    icon: 'library-outline',
    color: '#10502f',
    isExternal: true,
  },
  
  // Services
  {
    id: '4',
    title: 'Food Services',
    description: 'Weekly lunch menus, nutrition info, and meal accounts',
    category: 'services',
    icon: 'restaurant-outline',
    color: '#ee592b',
  },
  {
    id: '5',
    title: 'Absence Reporting',
    description: 'Report student absences and tardies online',
    category: 'services',
    icon: 'calendar-clear-outline',
    color: '#ee592b',
  },
  {
    id: '6',
    title: 'Nurse Office',
    description: 'Health forms, medication info, and wellness resources',
    category: 'services',
    icon: 'medical-outline',
    color: '#ee592b',
  },
  {
    id: '7',
    title: 'Transportation',
    description: 'Bus routes, schedules, and transportation updates',
    category: 'services',
    icon: 'bus-outline',
    color: '#ee592b',
  },
  {
    id: '8',
    title: 'School Store',
    description: 'Gator gear, supplies, and merchandise',
    category: 'services',
    icon: 'storefront-outline',
    color: '#ee592b',
    isExternal: true,
  },
  
  // Communication
  {
    id: '9',
    title: 'SchoolMessenger',
    description: 'Receive important school communications and alerts',
    category: 'communication',
    icon: 'mail-outline',
    color: '#3b82f6',
    isExternal: true,
  },
  {
    id: '10',
    title: 'Teacher Directory',
    description: 'Contact information for all faculty and staff',
    category: 'communication',
    icon: 'people-circle-outline',
    color: '#3b82f6',
  },
  
  // Community
  {
    id: '11',
    title: 'PTO Portal',
    description: 'Parent-Teacher Organization events and volunteer opportunities',
    category: 'community',
    icon: 'people-outline',
    color: '#8b5cf6',
  },
  {
    id: '12',
    title: 'Volunteer Hub',
    description: 'Sign up for volunteer opportunities and track hours',
    category: 'community',
    icon: 'heart-outline',
    color: '#8b5cf6',
  },
  {
    id: '13',
    title: 'Gator Giving',
    description: 'Support school programs through donations and fundraising',
    category: 'community',
    icon: 'gift-outline',
    color: '#8b5cf6',
    isExternal: true,
  },
  {
    id: '14',
    title: 'Athletics',
    description: 'Sports schedules, team rosters, and athletic information',
    category: 'community',
    icon: 'trophy-outline',
    color: '#8b5cf6',
  },
];

export const ResourcesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = allResources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleResourcePress = (resource: Resource) => {
    navigation.navigate('ResourceDetail' as never, { resource } as never);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Search resources..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-base text-gray-900"
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-200"
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
      >
        {resourceCategories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            className={cn(
              'flex-row items-center px-4 py-2 rounded-full mr-3',
              selectedCategory === category.id
                ? 'bg-gator-green'
                : 'bg-gray-100'
            )}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Ionicons
              name={category.icon as any}
              size={16}
              color={selectedCategory === category.id ? '#ffffff' : category.color}
              style={{ marginRight: 6 }}
            />
            <Text className={cn(
              'font-medium',
              selectedCategory === category.id
                ? 'text-white'
                : 'text-gray-700'
            )}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Resources Grid */}
      <ScrollView 
        className="flex-1 px-6 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-lg font-semibold text-gray-900">
            {selectedCategory === 'all' ? 'All Resources' : 
             resourceCategories.find(c => c.id === selectedCategory)?.name + ' Resources'}
          </Text>
          <Badge
            text={`${filteredResources.length} items`}
            variant="info"
            size="small"
          />
        </View>

        {filteredResources.length > 0 ? (
          <View className="flex-row flex-wrap justify-between">
            {filteredResources.map((resource) => (
              <View key={resource.id} className="w-[48%] mb-4">
                <ResourceTile
                  resource={resource}
                  onPress={() => handleResourcePress(resource)}
                  size="medium"
                />
              </View>
            ))}
          </View>
        ) : (
          <View className="bg-white rounded-xl p-8 items-center mt-8">
            <Ionicons name="search-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-4 mb-2">
              No resources found
            </Text>
            <Text className="text-gray-400 text-center">
              Try adjusting your search or category filter
            </Text>
          </View>
        )}
      </ScrollView>

      <GaitorFAB />
    </View>
  );
};