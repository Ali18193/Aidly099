import { User } from 'firebase/auth';

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  healthStatus: string;
}

export interface Session {
  id: string;
  nameAz: string;
  nameEn: string;
  specialtyAz: string;
  specialtyEn: string;
  avatar: string;
}

export interface Booking {
  id: string;
  psychId: string;
  psychNameAz: string;
  psychNameEn: string;
  specialtyAz: string;
  specialtyEn: string;
  avatar: string;
  time: string;
  date: string;
}

export interface TestResult {
  id: string;
  date: string;
  score: number;
  advice: string;
  mood: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  feedback?: 'positive' | 'negative' | null;
  feedbackComment?: string;
  detectedEmotion?: string;
}

export interface MoodLog {
  id: string;
  mood: string;
  note?: string;
  timestamp: any;
  dateLabel: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  category: 'personal' | 'work' | 'health' | 'other';
  createdAt: any;
}

export interface PastChatSession {
  id: string;
  psychId: string;
  psychNameAz: string;
  psychNameEn: string;
  avatar: string;
  date: string;
  time: string;
  messages: Message[];
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
