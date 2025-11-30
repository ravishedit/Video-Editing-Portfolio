export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  videoUrl?: string; // Optional real video URL
  description: string;
  color: string;
}

export enum ChatRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  role: ChatRole;
  text: string;
  timestamp: Date;
}
