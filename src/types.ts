export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
}

export interface AIConfig {
  userId: string;
  personality: string;
  style: string;
  interests: string;
  autoPostEnabled: boolean;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  isAI: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isAI: boolean;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}
