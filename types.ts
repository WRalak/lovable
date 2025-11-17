// types.ts
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  code?: string;
  hasArtifact?: boolean;
  attachments?: Attachment[];
  timestamp: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file' | 'link' | 'text';
  content?: string;
  url?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  pinned?: boolean;
}