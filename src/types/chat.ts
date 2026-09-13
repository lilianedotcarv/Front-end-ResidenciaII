export type MessageSender = 'user' | 'bot' | 'system';

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
}

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}

export interface BotConfig {
  name: string;
  status: string;
  avatar: string;
  welcomeMessage: string;
}
