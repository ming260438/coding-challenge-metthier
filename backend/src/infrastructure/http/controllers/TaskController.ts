import { Request, Response, NextFunction } from 'express';
import { GetAllTasksUseCase } from '../../../application/use-cases/GetAllTasksUseCase';
import { CreateTaskUseCase } from '../../../application/use-cases/CreateTaskUseCase';
import { UpdateTaskUseCase } from '../../../application/use-cases/UpdateTaskUseCase';
import { SoftDeleteTaskUseCase } from '../../../application/use-cases/SoftDeleteTaskUseCase';
import { TaskStatus } from '../../../domain/entities/Task';

/**
 * TaskController — HTTP adapter for the Task use cases.
 *
 * Responsibilities:
 *  - Parse & validate HTTP input (path params, query params, body)
 *  - Delegate to the appropriate use case
 *  - Map the result to an HTTP response
 *
 * It does NOT contain business logic — that belongs in the use cases.
 */
export class TaskController {
  constructor(
    private readonly getAllTasksUseCase: GetAllTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly softDeleteTaskUseCase: SoftDeleteTaskUseCase,
  ) {}

  // ─── GET /tasks ──────────────────────────────────────────────────────────────

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { status } = req.query;
      let taskStatus: TaskStatus | undefined;

      if (status) {
        const valid = Object.values(TaskStatus) as string[];
        if (!valid.includes(status as string)) {
          res.status(400).json({
            success: false,
            message: `Invalid status. Allowed values: ${valid.join(', ')}`,
          });
          return;
        }
        taskStatus = status as TaskStatus;
      }

      const tasks = await this.getAllTasksUseCase.execute(taskStatus);
      res.json({ success: true, data: tasks.map((t) => t.toJSON()), total: tasks.length });
    } catch (err) {
      next(err);
    }
  };

  // ─── POST /tasks ─────────────────────────────────────────────────────────────

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const task = await this.createTaskUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: task.toJSON(),
        message: 'Task created successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  // ─── PUT /tasks/:id ──────────────────────────────────────────────────────────

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const task = await this.updateTaskUseCase.execute(req.params.id, req.body);
      res.json({
        success: true,
        data: task.toJSON(),
        message: 'Task updated successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  // ─── DELETE /tasks/:id ───────────────────────────────────────────────────────

  softDelete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.softDeleteTaskUseCase.execute(req.params.id);
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
      next(err);
    }
  };
}
