/**
 * TaskStatus — mirrors the backend enum exactly.
 * Must stay in sync with the backend TaskStatus enum values.
 */
export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

/** Shape of a Task object returned from the API. */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  created_at: string; // ISO string from JSON
  updated_at: string;
  deleted_at: string | null;
}

/** Input shape for creating a new task. */
export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

/** Input shape for updating a task (all fields optional). */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
