import { AuthResponse, User, TodoList, TodoItem, ListStats, ReminderLog } from "../types";

const TOKEN_KEY = "todomaster_auth_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "An unexpected error occurred");
  }

  return data as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => request<{ user: User }>("/api/auth/me"),

  // Lists
  getLists: () => request<TodoList[]>("/api/lists"),

  createList: (name: string) =>
    request<TodoList>("/api/lists", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  updateList: (id: string, updates: { name?: string; isPublic?: boolean }) =>
    request<TodoList>(`/api/lists/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  deleteList: (id: string) =>
    request<{ success: boolean }>(`/api/lists/${id}`, {
      method: "DELETE",
    }),

  // Items
  getItems: (listId: string) => request<TodoItem[]>(`/api/lists/${listId}/items`),

  createItem: (
    listId: string,
    payload: {
      title: string;
      description?: string;
      tags?: string[];
      dueDate?: string;
      reminderEmail?: string;
    }
  ) =>
    request<TodoItem>(`/api/lists/${listId}/items`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateItem: (
    itemId: string,
    payload: Partial<{
      title: string;
      description: string;
      completed: boolean;
      tags: string[];
      dueDate: string;
      reminderEmail: string;
      order: number;
    }>
  ) =>
    request<TodoItem>(`/api/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  reorderItems: (listId: string, itemIds: string[]) =>
    request<TodoItem[]>(`/api/lists/${listId}/reorder`, {
      method: "PUT",
      body: JSON.stringify({ itemIds }),
    }),

  deleteItem: (itemId: string) =>
    request<{ success: boolean }>(`/api/items/${itemId}`, {
      method: "DELETE",
    }),

  // Public Sharing
  getSharedList: (shareToken: string) =>
    request<{
      list: TodoList;
      ownerName: string;
      items: TodoItem[];
      stats: ListStats;
    }>(`/api/shared/${shareToken}`),

  // Reminders
  triggerReminders: () =>
    request<{ triggeredCount: number; logs: ReminderLog[] }>("/api/reminders/trigger", {
      method: "POST",
    }),

  getReminderLogs: () => request<ReminderLog[]>("/api/reminders/logs"),
};
