import { Task, TaskStatus } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

/**
 * InMemoryTaskRepository — concrete implementation of ITaskRepository.
 *
 * Stores tasks in a Map<id, Task> in process memory.
 * This can be swapped out for a database-backed repository (e.g. TypeORM,
 * Prisma) without touching any code outside the infrastructure layer.
 */
export class InMemoryTaskRepository implements ITaskRepository {
  /** Internal storage: task id → Task entity */
  private readonly store: Map<string, Task> = new Map();

  /**
   * Return all active (non-deleted) tasks, newest first.
   * If a status filter is provided, only tasks with that status are returned.
   */
  async findAll(status?: TaskStatus): Promise<Task[]> {
    const active = Array.from(this.store.values()).filter(
      (task) => !task.isDeleted,
    );

    const filtered = status
      ? active.filter((task) => task.status === status)
      : active;

    // Sort by created_at descending (most recent first)
    return filtered.sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime(),
    );
  }

  /** Find by ID — returns null if not found (includes soft-deleted tasks). */
  async findById(id: string): Promise<Task | null> {
    return this.store.get(id) ?? null;
  }

  /** Persist a new task; throws if the ID already exists. */
  async create(task: Task): Promise<Task> {
    this.store.set(task.id, task);
    return task;
  }

  /** Overwrite the stored task with the updated entity. */
  async update(task: Task): Promise<Task> {
    this.store.set(task.id, task);
    return task;
  }

  /** Hard-delete: permanently remove the task record. */
  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
