export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface UserData {
  userId: string;
  telegramUser?: TelegramUser;
  memories?: Record<string, any>;
  settings?: Record<string, any>;
  [key: string]: any;
}

export interface Memory {
  id: string;
  type: string;
  content: string;
  title?: string;
  createdAt: string | number;
  chatId?: number;
  messageId?: number;
  mediaType?: string;
  mediaUrl?: string;
  remindAt?: string;
  url?: string;
  content_type?: string;
  user_id?: string;
  created_at?: number;
  [key: string]: any;
}
