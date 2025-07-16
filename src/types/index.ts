export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'services' | 'communication' | 'community';
  icon: string;
  color: string;
  url?: string;
  isExternal?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  description?: string;
  type: 'academic' | 'event' | 'deadline' | 'meeting';
  location?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  publishedAt: Date;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export type NotificationType = 'general' | 'urgent' | 'event' | 'academic';
export type ChatMessageType = 'text' | 'suggestion';

export interface ResourceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}