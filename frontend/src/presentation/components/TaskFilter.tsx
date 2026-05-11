import React from 'react';
import { TaskStatus } from '../../domain/entities/Task';

interface FilterOption {
  value: TaskStatus | 'All';
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'All', label: 'All' },
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
];

interface TaskFilterProps {
  activeFilter: TaskStatus | 'All';
  onFilterChange: (status: TaskStatus | 'All') => void;
  /** Per-status task counts shown in the badge next to each label. */
  counts: Record<TaskStatus | 'All', number>;
}

/**
 * TaskFilter — horizontal pill-button group for filtering tasks by status.
 * The active filter is highlighted in indigo; inactive buttons have a subtle border.
 */
export const TaskFilter: React.FC<TaskFilterProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tasks by status">
      {FILTER_OPTIONS.map(({ value, label }) => {
        const isActive = activeFilter === value;
        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            aria-pressed={isActive}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                isActive ? 'bg-indigo-500 text-indigo-100' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {counts[value]}
            </span>
          </button>
        );
      })}
    </div>
  );
};
