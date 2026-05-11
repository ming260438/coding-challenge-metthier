import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

/**
 * createTaskRouter — wires HTTP method + path to the corresponding controller action.
 *
 * Routes:
 *   GET    /tasks       → list all tasks (optional ?status= filter)
 *   POST   /tasks       → create a new task
 *   PUT    /tasks/:id   → update an existing task
 *   DELETE /tasks/:id   → soft-delete a task
 */
export function createTaskRouter(controller: TaskController): Router {
  const router = Router();

  router.get('/', controller.getAll);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.softDelete);

  return router;
}
