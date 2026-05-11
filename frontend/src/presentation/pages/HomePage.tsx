import React, { useEffect, useState } from 'react';
import {
  useTaskStore,
  selectFilteredTasks,
  selectStatusCounts,
} from '../store/useTaskStore';
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../../domain/entities/Task';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { TaskFilter } from '../components/TaskFilter';
import { Modal } from '../components/Modal';

/**
 * HomePage — the single page of the application.
 *
 * Layout:
 *  ┌─────────────── Header (sticky) ───────────────┐
 *  │  Title + "New Task" button                    │
 *  ├───────────────────────────────────────────────┤
 *  │  Error banner (conditional)                   │
 *  │  Filter bar                                   │
 *  │  Task grid  /  Empty state  /  Loading        │
 *  └───────────────────────────────────────────────┘
 *
 * Modals:
 *  - Create Task modal
 *  - Edit Task modal
 */
export const HomePage: React.FC = () => {
  // ─── Store ────────────────────────────────────────────────────────────────
  const isLoading = useTaskStore((s) => s.isLoading);
  const error = useTaskStore((s) => s.error);
  const filterStatus = useTaskStore((s) => s.filterStatus);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const createTask = useTaskStore((s) => s.createTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const setFilterStatus = useTaskStore((s) => s.setFilterStatus);
  const clearError = useTaskStore((s) => s.clearError);

  // Derived selectors (stable references, won't cause extra re-renders)
  const filteredTasks = useTaskStore(selectFilteredTasks);
  const counts = useTaskStore(selectStatusCounts);

  // ─── Local UI state ───────────────────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tasks once on mount
  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleCreate = async (data: CreateTaskInput | UpdateTaskInput) => {
    setIsSubmitting(true);
    try {
      await createTask(data as CreateTaskInput);
      setIsCreateOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: CreateTaskInput | UpdateTaskInput) => {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      await updateTask(editingTask.id, data as UpdateTaskInput);
      setEditingTask(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Task Manager</h1>
            <p className="text-xs text-gray-400 mt-0.5">Stay on top of everything</p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={clearError}
              aria-label="Dismiss error"
              className="ml-4 text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-6">
          <TaskFilter
            activeFilter={filterStatus}
            onFilterChange={setFilterStatus}
            counts={counts}
          />
        </div>

        {/* Task Grid / States */}
        {isLoading ? (
          <LoadingState />
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            filterStatus={filterStatus}
            onCreateClick={() => setIsCreateOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
                onEdit={setEditingTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Task">
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
        <TaskForm
          onSubmit={handleUpdate}
          onCancel={() => setEditingTask(null)}
          initialData={editingTask ?? undefined}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-3">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    <p className="text-sm text-gray-400">Loading tasks…</p>
  </div>
);

interface EmptyStateProps {
  filterStatus: TaskStatus | 'All';
  onCreateClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ filterStatus, onCreateClick }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
      <svg className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
    <h3 className="mb-1 text-base font-semibold text-gray-700">No tasks found</h3>
    <p className="mb-5 text-sm text-gray-400">
      {filterStatus !== 'All'
        ? `No tasks with status "${filterStatus}".`
        : 'Get started by creating your first task.'}
    </p>
    {filterStatus === 'All' && (
      <button
        onClick={onCreateClick}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        Create a task →
      </button>
    )}
  </div>
);
