export type RecordingStatus = 'recording' | 'paused' | 'processing' | 'completed' | 'failed';

export interface Recording {
  id: string;
  title: string;
  timestamp: number;
  duration: number; // in seconds
  status: RecordingStatus;
  summary?: string;
  keyPoints?: string[];
  conclusions?: string[];
  todos?: { task: string; owner: string }[];
  transcription?: { time: string; text: string }[];
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export type Page = 'home' | 'records' | 'knowledge' | 'profile' | 'recording' | 'processing' | 'detail';
