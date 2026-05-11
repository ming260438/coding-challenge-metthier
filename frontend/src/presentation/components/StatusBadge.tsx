import React from 'react';
import { TaskStatus } from '../../domain/entities/Task';

interface StatusBadgeProps {
  status: TaskStatus;
}

/** Color configuration for each task status. */
const statusConfig: Record<TaskStatus, { className: string }> = {
  [TaskStatus.TODO]: {
    className: 'bg-slate-100 text-slate-600 ring-slate-200',
  },
  [TaskStatus.IN_PROGRESS]: {
    className: 'bg-blue-50 text-blue-700 ring-blue-200',
  },
  [TaskStatus.DONE]: {
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
};

/**
 * StatusBadge — a pill-shaped label that reflects the current task status
 * with colour-coded styling.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { className } = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {status}
    </span>
  );
};
