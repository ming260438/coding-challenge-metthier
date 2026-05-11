import { Task, TaskStatus } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

/**
 * GetAllTasksUseCase
 * Returns a list of all active tasks, optionally filtered by status.
 */
export class GetAllTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(status?: TaskStatus): Promise<Task[]> {
    return this.taskRepository.findAll(status);
  }
}
