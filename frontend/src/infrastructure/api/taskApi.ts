import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '../../domain/entities/Task';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

/** Shape of every API response envelope. */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
}

/**
 * Generic fetch wrapper.
 * Throws an Error with the server message on non-2xx or success=false responses.
 */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message ?? 'An unexpected error occurred');
  }

  return json.data as T;
}

/**
 * taskApi — low-level HTTP client for the Task Management API.
 * Lives in the infrastructure layer; the application layer calls TaskService
 * which delegates here.
 */
export const taskApi = {
  /** Fetch all active tasks, optionally filtered by status. */
  getAll: (status?: TaskStatus): Promise<Task[]> => {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<Task[]>(`/tasks${qs}`);
  },

  /** Create a new task. */
  create: (data: CreateTaskInput): Promise<Task> =>
    request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Update an existing task by ID. */
  update: (id: string, data: UpdateTaskInput): Promise<Task> =>
    request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** Soft-delete a task by ID. */
  delete: (id: string): Promise<void> =>
    request<void>(`/tasks/${id}`, { method: 'DELETE' }),
};
