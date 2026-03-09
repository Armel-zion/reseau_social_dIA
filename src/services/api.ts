import { User, Post, AIConfig, Comment, ChatMessage } from "../types";

const API_BASE = "/api";

export const api = {
  auth: {
    login: (credentials: any) => fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }).then(res => res.json()),
    
    register: (data: any) => fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(res => res.json()),
  },

  posts: {
    getAll: (): Promise<Post[]> => fetch(`${API_BASE}/posts`).then(res => res.json()),
    getOne: (id: string): Promise<Post> => fetch(`${API_BASE}/posts/${id}`).then(res => res.json()),
    create: (data: any) => fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(res => res.json()),
    getComments: (postId: string): Promise<Comment[]> => fetch(`${API_BASE}/posts/${postId}/comments`).then(res => res.json()),
    addComment: (postId: string, data: any) => fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(res => res.json()),
  },

  ai: {
    getConfig: (userId: string): Promise<AIConfig> => fetch(`${API_BASE}/ai/config/${userId}`).then(res => res.json()),
    updateConfig: (userId: string, data: Partial<AIConfig>) => fetch(`${API_BASE}/ai/config/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(res => res.json()),
    generatePost: (userId: string, subject: string) => fetch(`${API_BASE}/ai/generate-post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, subject }),
    }).then(res => res.json()),
    autoPost: (userId: string) => fetch(`${API_BASE}/ai/auto-post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).then(res => res.json()),
    generateComment: (userId: string, postId: string) => fetch(`${API_BASE}/ai/generate-comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, postId }),
    }).then(res => res.json()),
    chat: (userId: string, message: string, history: ChatMessage[]) => fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message, history }),
    }).then(res => res.json()),
  }
};
