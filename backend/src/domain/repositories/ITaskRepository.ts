import { Task, TaskStatus } from '../entities/Task';

/**
 * ITaskRepository — the persistence contract for Task entities.
 *
 * Defined in the domain layer so that the application layer depends only
 * on this abstraction (Dependency Inversion Principle). The concrete
 * implementation lives in the infrastructure layer.
 */
export interface ITaskRepository {
  /**
   * Return all active (non-deleted) tasks.
   * @param status — optional filter; when provided, only tasks with that status are returned.
   */
  findAll(status?: TaskStatus): Promise<Task[]>;

  /**
   * Find a single task by ID, regardless of deleted_at state.
   * Returns null if no task with the given ID exists.
   */
  findById(id: string): Promise<Task | null>;

  /** Persist a newly created task and return it. */
  create(task: Task): Promise<Task>;

  /** Persist mutations on an existing task and return the updated entity. */
  update(task: Task): Promise<Task>;

  /** Permanently remove a task record (hard delete). */
  delete(id: string): Promise<void>;
}
