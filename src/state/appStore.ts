import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Student {
  id: string;
  name: string;
  grade: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'urgent' | 'event' | 'academic';
  timestamp: Date;
  read: boolean;
  category: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestedResources?: string[];
}

interface AppState {
  // User & Students
  selectedStudent: Student | null;
  students: Student[];
  
  // Theme & Preferences
  isDarkMode: boolean;
  notificationSettings: {
    general: boolean;
    urgent: boolean;
    events: boolean;
    academic: boolean;
  };
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Ask Gaitor Chat
  chatHistory: ChatMessage[];
  isGaitorVisible: boolean;
  
  // Actions
  setSelectedStudent: (student: Student | null) => void;
  addStudent: (student: Student) => void;
  toggleDarkMode: () => void;
  updateNotificationSettings: (settings: Partial<AppState['notificationSettings']>) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addChatMessage: (message: Omit<ChatMessage, 'id'>) => void;
  clearChatHistory: () => void;
  toggleGaitor: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedStudent: null,
      students: [
        {
          id: '1',
          name: 'Alex Johnson',
          grade: '10th Grade',
        },
        {
          id: '2', 
          name: 'Emma Johnson',
          grade: '8th Grade',
        }
      ],
      isDarkMode: false,
      notificationSettings: {
        general: true,
        urgent: true,
        events: true,
        academic: true,
      },
      notifications: [
        {
          id: '1',
          title: 'Parent-Teacher Conferences',
          message: 'Sign up for parent-teacher conferences now open!',
          type: 'event',
          timestamp: new Date(),
          read: false,
          category: 'Events',
        },
        {
          id: '2',
          title: 'Lunch Menu Update',
          message: 'New lunch options available this week.',
          type: 'general',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          read: false,
          category: 'Food Services',
        },
        {
          id: '3',
          title: 'School Closure Alert',
          message: 'Early dismissal tomorrow due to weather conditions.',
          type: 'urgent',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: true,
          category: 'General',
        },
      ],
      unreadCount: 2,
      chatHistory: [],
      isGaitorVisible: false,

      // Actions
      setSelectedStudent: (student) => set({ selectedStudent: student }),
      
      addStudent: (student) => set((state) => ({
        students: [...state.students, student]
      })),
      
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      updateNotificationSettings: (settings) => set((state) => ({
        notificationSettings: { ...state.notificationSettings, ...settings }
      })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          { ...notification, id: Date.now().toString() },
          ...state.notifications
        ],
        unreadCount: state.unreadCount + 1
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - (state.notifications.find(n => n.id === id && !n.read) ? 1 : 0))
      })),
      
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      })),
      
      addChatMessage: (message) => set((state) => ({
        chatHistory: [...state.chatHistory, { ...message, id: Date.now().toString() }]
      })),
      
      clearChatHistory: () => set({ chatHistory: [] }),
      
      toggleGaitor: () => set((state) => ({ isGaitorVisible: !state.isGaitorVisible })),
    }),
    {
      name: 'gator-hub-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedStudent: state.selectedStudent,
        students: state.students,
        isDarkMode: state.isDarkMode,
        notificationSettings: state.notificationSettings,
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        chatHistory: state.chatHistory,
      }),
    }
  )
);