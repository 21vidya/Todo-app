export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface TodoItem {
  id: string;
  listId: string;
  title: string;
  description?: string;
  completed: boolean;
  tags: string[]; // tag names or IDs
  order: number;
  dueDate?: string; // YYYY-MM-DD or ISO string
  reminderEmail?: string;
  reminderSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoList {
  id: string;
  userId: string;
  name: string;
  shareToken: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  itemCount?: number;
}

export interface ListStats {
  total: number;
  completed: number;
  pending: number;
  tagCounts: Record<string, number>;
  noTagCount: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ReminderLog {
  id: string;
  todoTitle: string;
  listName: string;
  email: string;
  sentAt: string;
}
