import { Task, TaskStatus } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { UpdateTaskDto } from '../dtos/UpdateTaskDto';
import { AppError } from '../errors/AppError';

/**
 * UpdateTaskUseCase
 * Finds the task, applies partial updates via domain methods, and persists.
 */
export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (task.isDeleted) {
      throw new AppError('Cannot update a deleted task', 400);
    }

    // Validate status enum if provided
    if (dto.status && !Object.values(TaskStatus).includes(dto.status)) {
      throw new AppError(
        `Invalid status. Allowed values: ${Object.values(TaskStatus).join(', ')}`,
        400,
      );
    }

    // Apply only the fields that were provided
    if (dto.title !== undefined) task.updateTitle(dto.title);
    if (dto.description !== undefined) task.updateDescription(dto.description);
    if (dto.status !== undefined) task.updateStatus(dto.status);

    return this.taskRepository.update(task);
  }
}
