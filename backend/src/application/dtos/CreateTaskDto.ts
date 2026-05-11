import { TaskStatus } from '../../domain/entities/Task';

/**
 * DTO for creating a new task.
 * Received from the HTTP layer and passed to the CreateTaskUseCase.
 */
export interface CreateTaskDto {
  /** Required — the task title. */
  title: string;
  /** Optional — a longer description of the task. */
  description?: string;
  /** Defaults to TaskStatus.TODO if omitted. */
  status?: TaskStatus;
}
