import express, { Application } from 'express';
import cors from 'cors';

// ─── Infrastructure ───────────────────────────────────────────────────────────
import { InMemoryTaskRepository } from '../infrastructure/repositories/InMemoryTaskRepository';
import { TaskController } from '../infrastructure/http/controllers/TaskController';
import { createTaskRouter } from '../infrastructure/http/routes/taskRoutes';
import { errorHandler } from '../infrastructure/http/middlewares/errorHandler';

// ─── Application Use Cases ────────────────────────────────────────────────────
import { GetAllTasksUseCase } from '../application/use-cases/GetAllTasksUseCase';
import { CreateTaskUseCase } from '../application/use-cases/CreateTaskUseCase';
import { UpdateTaskUseCase } from '../application/use-cases/UpdateTaskUseCase';
import { SoftDeleteTaskUseCase } from '../application/use-cases/SoftDeleteTaskUseCase';

/**
 * createApp — Composition Root.
 *
 * This is the only place where concrete classes are instantiated and wired
 * together. All other layers depend only on abstractions (interfaces).
 *
 * Dependency flow (Clean Architecture):
 *   HTTP ← Controller ← Use Cases ← Repository Interface ← Repository Impl
 */
export function createApp(): Application {
  const app = express();

  // ─── Global Middleware ──────────────────────────────────────────────────────
  // app.use(cors());
  app.use(cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  }));
  app.use(express.json());

  // ─── Dependency Injection ───────────────────────────────────────────────────
  // Infrastructure (outermost ring)
  const taskRepository = new InMemoryTaskRepository();

  // Application use cases (inject repository via interface)
  const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
  const createTaskUseCase = new CreateTaskUseCase(taskRepository);
  const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
  const softDeleteTaskUseCase = new SoftDeleteTaskUseCase(taskRepository);

  // HTTP controllers (inject use cases)
  const taskController = new TaskController(
    getAllTasksUseCase,
    createTaskUseCase,
    updateTaskUseCase,
    softDeleteTaskUseCase,
  );

  // ─── Routes ─────────────────────────────────────────────────────────────────
  app.use('/tasks', createTaskRouter(taskController));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ─── Error Handler (must be registered last) ────────────────────────────────
  app.use(errorHandler);

  return app;
}
