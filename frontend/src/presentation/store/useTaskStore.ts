import { create } from 'zustand';
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../../domain/entities/Task';
import { taskService } from '../../application/services/TaskService';

// ─── State Shape ──────────────────────────────────────────────────────────────

interface TaskState {
  /** Full list of tasks fetched from the server (no client filter applied yet). */
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  /** The currently active status filter; 'All' means no filter. */
  filterStatus: TaskStatus | 'All';

  // ─── Actions ───────────────────────────────────────────────────────────────
  fetchTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilterStatus: (status: TaskStatus | 'All') => void;
  clearError: () => void;
}

/**
 * useTaskStore — central Zustand store for the task management application.
 *
 * Design decisions:
 * - The full task list is always fetched from the server and held in `tasks`.
 * - Status filtering is performed on the client (see `filteredTasks` selector
 *   in components) to avoid a round-trip on every filter change and to keep
 *   badge counts accurate.
 * - Optimistic UI: after create/update/delete the local state is updated
 *   immediately without a full refetch.
 */
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  filterStatus: 'All',

  // ─── fetchTasks ─────────────────────────────────────────────────────────────
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getAllTasks();
      set({ tasks, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch tasks',
      });
    }
  },

  // ─── createTask ─────────────────────────────────────────────────────────────
  createTask: async (input: CreateTaskInput) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await taskService.createTask(input);
      // Prepend so the new task appears at the top of the list
      set((state) => ({ tasks: [newTask, ...state.tasks], isLoading: false }));
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to create task',
      });
      throw err; // Re-throw so the form can react (e.g. keep modal open)
    }
  },

  // ─── updateTask ─────────────────────────────────────────────────────────────
  updateTask: async (id: string, input: UpdateTaskInput) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await taskService.updateTask(id, input);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
        isLoading: false,
      }));
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to update task',
      });
      throw err;
    }
  },

  // ─── deleteTask ─────────────────────────────────────────────────────────────
  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.deleteTask(id);
      // Remove from local state immediately (optimistic)
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to delete task',
      });
      throw err;
    }
  },

  // ─── setFilterStatus ────────────────────────────────────────────────────────
  setFilterStatus: (status: TaskStatus | 'All') => {
    set({ filterStatus: status });
  },

  // ─── clearError ─────────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),

  // ─── Selectors (used externally) ────────────────────────────────────────────
  // filteredTasks is derived in components:
  //   const filtered = filterStatus === 'All' ? tasks : tasks.filter(...)
  // This avoids storing derived state in the store itself.
}));

/**
 * Convenience selector: returns tasks filtered by the current filterStatus.
 * Usage: const filtered = useTaskStore(selectFilteredTasks);
 */
export const selectFilteredTasks = (state: TaskState): Task[] => {
  const { tasks, filterStatus } = state;
  if (filterStatus === 'All') return tasks;
  return tasks.filter((t) => t.status === filterStatus);
};

/**
 * Convenience selector: returns per-status counts from the full task list.
 * Usage: const counts = useTaskStore(selectStatusCounts);
 */
export const selectStatusCounts = (
  state: TaskState,
): Record<TaskStatus | 'All', number> => ({
  All: state.tasks.length,
  [TaskStatus.TODO]: state.tasks.filter((t) => t.status === TaskStatus.TODO).length,
  [TaskStatus.IN_PROGRESS]: state.tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
  [TaskStatus.DONE]: state.tasks.filter((t) => t.status === TaskStatus.DONE).length,
});
