/**
 * TaskStatus Enum
 * Represents the possible lifecycle states of a task.
 */
export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

/**
 * TaskProps — raw data shape used to construct a Task entity.
 */
export interface TaskProps {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
  /** Null means the task is active (not soft-deleted). */
  deleted_at: Date | null;
}

/**
 * Task Entity — the core business object of the domain.
 *
 * Encapsulates all task data and enforces business invariants through
 * domain methods instead of exposing raw property setters.
 */
export class Task {
  private readonly _id: string;
  private _title: string;
  private _description?: string;
  private _status: TaskStatus;
  private readonly _created_at: Date;
  private _updated_at: Date;
  private _deleted_at: Date | null;

  constructor(props: TaskProps) {
    this._id = props.id;
    this._title = props.title;
    this._description = props.description;
    this._status = props.status;
    this._created_at = props.created_at;
    this._updated_at = props.updated_at;
    this._deleted_at = props.deleted_at;
  }

  // ─── Getters ────────────────────────────────────────────────────────────────

  get id(): string { return this._id; }
  get title(): string { return this._title; }
  get description(): string | undefined { return this._description; }
  get status(): TaskStatus { return this._status; }
  get created_at(): Date { return this._created_at; }
  get updated_at(): Date { return this._updated_at; }
  get deleted_at(): Date | null { return this._deleted_at; }
  /** Returns true if this task has been soft-deleted. */
  get isDeleted(): boolean { return this._deleted_at !== null; }

  // ─── Domain Methods ──────────────────────────────────────────────────────────

  /** Update the task title. Throws if the new title is blank. */
  updateTitle(title: string): void {
    const trimmed = title?.trim();
    if (!trimmed) throw new Error('Title cannot be empty');
    this._title = trimmed;
    this._touch();
  }

  /** Replace the task description (pass undefined to clear it). */
  updateDescription(description?: string): void {
    this._description = description?.trim() || undefined;
    this._touch();
  }

  /** Transition the task to a new status. */
  updateStatus(status: TaskStatus): void {
    this._status = status;
    this._touch();
  }

  /**
   * Soft-delete the task.
   * Sets deleted_at to now; the record is retained in storage.
   */
  softDelete(): void {
    this._deleted_at = new Date();
    this._touch();
  }

  /** Restore a previously soft-deleted task. */
  restore(): void {
    this._deleted_at = null;
    this._touch();
  }

  /** Serialize the entity to a plain JSON-safe object. */
  toJSON(): TaskProps {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      status: this._status,
      created_at: this._created_at,
      updated_at: this._updated_at,
      deleted_at: this._deleted_at,
    };
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  /** Bump the updated_at timestamp on every mutation. */
  private _touch(): void {
    this._updated_at = new Date();
  }
}
