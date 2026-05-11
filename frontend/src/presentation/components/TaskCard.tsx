import React, { useState } from 'react';
import { Task, TaskStatus, UpdateTaskInput } from '../../domain/entities/Task';
import { StatusBadge } from './StatusBadge';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, data: UpdateTaskInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  /** Triggers the edit modal in the parent. */
  onEdit: (task: Task) => void;
}

/** Background color per task status. */
const statusBg: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-slate-50 border-slate-200',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-50 border-blue-200',
  [TaskStatus.DONE]: 'bg-emerald-50 border-emerald-200',
};

/** Human-readable date formatter. */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

/**
 * TaskCard — displays a single task with inline status switching and
 * edit / soft-delete actions.
 *
 * Inline status buttons let users advance a task without opening the full
 * edit modal, keeping common workflows fast.
 */
export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, onEdit }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === task.status) return;
    setIsChangingStatus(true);
    try {
      await onUpdate(task.id, { status: newStatus });
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(task.id);
  };

  return (
    <div className={`flex flex-col rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ${statusBg[task.status]}`}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="flex-1 min-w-0 font-semibold text-gray-900 leading-snug break-words">
          {task.title}
        </h3>
        <StatusBadge status={task.status} />
      </div>

      {/* ── Description ────────────────────────────────────────────────────── */}
      {task.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* ── Inline Status Switcher ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 mb-4 mt-auto pt-2">
        {Object.values(TaskStatus).map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={isChangingStatus || task.status === s}
            title={`Mark as ${s}`}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              task.status === s
                ? 'bg-indigo-100 text-indigo-700 cursor-default'
                : 'border border-gray-200 bg-gray-50 text-gray-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600'
            } disabled:opacity-50`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-400">{formatDate(task.created_at)}</span>

        {showConfirm ? (
          /* ── Delete confirmation ───────────────────────────────────────── */
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-500 font-medium">Delete?</span>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-600 transition"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              No
            </button>
          </div>
        ) : (
          /* ── Action buttons ────────────────────────────────────────────── */
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition"
            >
              Edit
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
