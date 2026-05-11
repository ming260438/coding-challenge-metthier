import { TaskStatus } from '../../domain/entities/Task';

/**
 * DTO for updating an existing task.
 * All fields are optional — only the provided fields will be updated.
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
