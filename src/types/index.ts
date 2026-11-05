export type ActiveModule =
  | 'home'
  | 'chat'
  | 'voice'
  | 'messages'
  | 'instagram'
  | 'reddit'
  | 'contacts'
  | 'assignment'
  | 'location'
  | 'screen'
  | 'photoeditor'
  | 'phoneinfo'
  | 'automation'
  | 'notifications'
  | 'history'
  | 'privacy'
  | 'studio';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'pinky' | 'system';
  text: string;
  timestamp: string;
  model: 'online-claude' | 'offline-local';
  tokensUsed?: number;
}

export interface SocialComment {
  id: string;
  platform: 'instagram' | 'reddit';
  author: string;
  content: string;
  postTitle: string;
  sentiment: 'positive' | 'neutral' | 'question' | 'sensitive' | 'spam';
  category: 'compliment' | 'greeting' | 'faq' | 'personal' | 'abuse';
  suggestedReply: string;
  status: 'pending' | 'auto_published' | 'approved' | 'rejected' | 'duplicate_prevented';
  timestamp: string;
}

export interface ContactItem {
  id: string;
  name: string;
  phone: string;
  relation: 'VIP' | 'Work' | 'Family' | 'General';
  status: 'allowed' | 'restricted' | 'blocked';
  customTone: 'professional' | 'friendly' | 'concise' | 'silent';
  autoReplyEnabled: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  category: 'social' | 'voice' | 'system' | 'messaging';
  lastRun?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  category: 'security' | 'social' | 'screen' | 'location' | 'ai';
  status: 'success' | 'warn' | 'blocked';
}

export interface DeviceHealth {
  batteryLevel: number;
  isCharging: boolean;
  batteryTempC: number;
  cpuTempC: number;
  isOnline: boolean;
  screenStreamActive: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
}

export interface ProjectSourceFile {
  path: string;
  name: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'json' | 'typescript' | 'sql' | 'markdown';
  module: 'Android App' | 'Jetpack Compose UI' | 'Database & Room' | 'AI & Voice' | 'Backend API' | 'Configuration & Gradle';
  content: string;
  description: string;
}
