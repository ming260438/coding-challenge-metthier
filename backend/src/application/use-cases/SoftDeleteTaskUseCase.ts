import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { AppError } from '../errors/AppError';

/**
 * SoftDeleteTaskUseCase
 * Marks a task as deleted (sets deleted_at) without removing it from storage.
 * This satisfies the bonus soft-delete requirement.
 */
export class SoftDeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (task.isDeleted) {
      throw new AppError('Task is already deleted', 400);
    }

    task.softDelete();
    await this.taskRepository.update(task);
  }
}
