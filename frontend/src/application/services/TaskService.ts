import { taskApi } from '../../infrastructure/api/taskApi';
import { Task, CreateTaskInput, UpdateTaskInput } from '../../domain/entities/Task';

/**
 * TaskService — application-layer service.
 *
 * Acts as an anti-corruption layer between the Zustand store and the raw API
 * client. Any business-level validation or transformation that does not belong
 * in the UI lives here.
 */
export class TaskService {
  /** Return all active tasks (no client-side status filter — done server-side). */
  async getAllTasks(): Promise<Task[]> {
    return taskApi.getAll();
  }

  /** Validate and create a task. */
  async createTask(input: CreateTaskInput): Promise<Task> {
    if (!input.title?.trim()) {
      throw new Error('Title is required');
    }
    return taskApi.create(input);
  }

  /** Update a task by ID. */
  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    return taskApi.update(id, input);
  }

  /** Soft-delete a task by ID. */
  async deleteTask(id: string): Promise<void> {
    return taskApi.delete(id);
  }
}

/** Singleton instance shared across the application. */
export const taskService = new TaskService();
