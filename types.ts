export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  department?: string;
  phone?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'file';
}

export interface Message {
  id: string;
  sender: User;
  body: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface Thread {
  id: string;
  subject: string;
  participants: User[];
  messages: Message[];
  timestamp: string; // Timestamp of the last message
  isRead: boolean;
  isPinned: boolean;
  isStarred?: boolean;
  category: 'primary' | 'promotions' | 'social' | 'updates' | 'forums' | 'todos' | 'finance' | 'feedback' | 'travel';
  snoozedUntil?: string;
  tags?: string[];
  commenter?: User;
  account: 'microhard' | 'liverpool' | 'innovate';
  isArchived?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  participant: User;
  messages: ChatMessage[];
  unreadCount: number;
}

export interface DriveFile {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'spreadsheet' | 'presentation' | 'pdf' | 'image' | 'video';
  owner: User;
  lastModified: string;
  size?: number; // Folders won't have a size
  isStarred: boolean;
  path: string;
}