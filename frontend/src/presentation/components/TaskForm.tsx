import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../../domain/entities/Task';

interface TaskFormProps {
  /** Called with the validated form data. Should throw on failure. */
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  onCancel: () => void;
  /** When provided, the form is in "edit" mode. */
  initialData?: Task;
  isLoading?: boolean;
}

/**
 * TaskForm — shared form for creating and editing tasks.
 *
 * In create mode, all fields start empty (status defaults to "To Do").
 * In edit mode, fields are pre-filled from `initialData`.
 */
export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(initialData?.status ?? TaskStatus.TODO);
  const [titleError, setTitleError] = useState('');

  // Sync fields when `initialData` changes (e.g. opening a different task for edit)
  useEffect(() => {
    setTitle(initialData?.title ?? '');
    setDescription(initialData?.description ?? '');
    setStatus(initialData?.status ?? TaskStatus.TODO);
    setTitleError('');
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError('');
    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (titleError) setTitleError(''); }}
          placeholder="What needs to be done?"
          className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
            titleError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
          }`}
        />
        {titleError && <p className="mt-1 text-xs text-red-500">{titleError}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="task-desc" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details (optional)…"
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="task-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
        >
          {Object.values(TaskStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Saving…' : initialData ? 'Save Changes' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
