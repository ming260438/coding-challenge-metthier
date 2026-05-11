import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { CreateTaskDto } from '../dtos/CreateTaskDto';
import { AppError } from '../errors/AppError';

/**
 * CreateTaskUseCase
 * Validates the incoming DTO, constructs a new Task entity, and persists it.
 */
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDto): Promise<Task> {
    // ─── Validation ───────────────────────────────────────────────────────────
    if (!dto.title || dto.title.trim().length === 0) {
      throw new AppError('Title is required', 400);
    }

    // Validate status enum if provided
    if (dto.status && !Object.values(TaskStatus).includes(dto.status)) {
      throw new AppError(
        `Invalid status. Allowed values: ${Object.values(TaskStatus).join(', ')}`,
        400,
      );
    }

    // ─── Build Entity ─────────────────────────────────────────────────────────
    const now = new Date();
    const task = new Task({
      id: uuidv4(),
      title: dto.title.trim(),
      description: dto.description?.trim() || undefined,
      status: dto.status ?? TaskStatus.TODO,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    });

    return this.taskRepository.create(task);
  }
}
