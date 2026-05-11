# Task Management Application

A full-stack Task Management app built with **Node.js/Express** (backend) and **React + Tailwind CSS** (frontend), structured using **Clean Architecture** principles.

---

## Architecture Overview

```
coding-challenge-metthier/
├── backend/   # Node.js / Express REST API
└── frontend/  # React + Vite + Tailwind CSS SPA
```

### Clean Architecture Layers (both backend & frontend)

```
Domain        → Core entities & repository interfaces (no dependencies)
Application   → Use cases / services (depends on Domain only)
Infrastructure → Concrete implementations (DB, HTTP, API clients)
Presentation  → Controllers / React components / Zustand store
```

---

## Backend

### Tech Stack
| | |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| Storage | In-Memory (easily swappable to a database) |

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/tasks` | List all active tasks |
| `GET` | `/tasks?status=To Do` | List tasks filtered by status |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/:id` | Update title / description / status |
| `DELETE` | `/tasks/:id` | Soft-delete a task |
| `GET` | `/health` | Health check |

### Task Entity

```json
{
  "id": "uuid",
  "title": "string (required)",
  "description": "string (optional)",
  "status": "To Do | In Progress | Done",
  "created_at": "ISO date",
  "updated_at": "ISO date",
  "deleted_at": "ISO date | null"
}
```

### Backend Structure

```
backend/src/
├── domain/
│   ├── entities/Task.ts               ← Task entity & TaskStatus enum
│   └── repositories/ITaskRepository.ts ← Persistence interface
├── application/
│   ├── errors/AppError.ts             ← Custom HTTP error class
│   ├── dtos/CreateTaskDto.ts
│   ├── dtos/UpdateTaskDto.ts
│   └── use-cases/
│       ├── GetAllTasksUseCase.ts
│       ├── CreateTaskUseCase.ts
│       ├── UpdateTaskUseCase.ts
│       └── SoftDeleteTaskUseCase.ts   ← Bonus: soft delete
├── infrastructure/
│   ├── repositories/InMemoryTaskRepository.ts
│   └── http/
│       ├── controllers/TaskController.ts
│       ├── middlewares/errorHandler.ts
│       └── routes/taskRoutes.ts
└── main/
    ├── app.ts                         ← Composition root (DI wiring)
    └── server.ts                      ← Entry point
```

### Setup & Run

```bash
cd backend
npm install
npm run dev        # Development (ts-node + nodemon) → http://localhost:3001
npm run build      # Compile TypeScript to dist/
npm start          # Run compiled output
```

---

## Frontend

### Tech Stack
| | |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| State | Zustand |
| HTTP | Fetch API |

### Features
- **Task list** — responsive card grid
- **Create task** — modal form with validation
- **Edit task** — pre-filled modal form
- **Delete task** — inline confirmation (soft-delete via API)
- **Inline status switcher** — change status directly on the card
- **Filter by status** — pill filter bar with live badge counts
- **Error banner** — dismissable API error messages
- **Loading state** — spinner while fetching

### Frontend Structure

```
frontend/src/
├── domain/
│   └── entities/Task.ts               ← Shared Task types & enums
├── application/
│   └── services/TaskService.ts        ← Orchestrates API calls
├── infrastructure/
│   └── api/taskApi.ts                 ← Fetch-based API client
└── presentation/
    ├── store/useTaskStore.ts           ← Zustand store + selectors
    ├── components/
    │   ├── StatusBadge.tsx
    │   ├── Modal.tsx
    │   ├── TaskForm.tsx
    │   ├── TaskFilter.tsx
    │   └── TaskCard.tsx
    └── pages/
        └── HomePage.tsx
```

### Setup & Run

```bash
cd frontend
npm install
npm run dev        # Development server → http://localhost:3000
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

> The frontend expects the backend at `http://localhost:3001`.  
> Change `VITE_API_URL` in `frontend/.env` to point to a different host.

---

## Running Both Together

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Clean Architecture | Clear separation of concerns; business logic is framework-agnostic and easily testable |
| In-memory repository | Simple, zero-dependency storage for a challenge; swap `InMemoryTaskRepository` for a Prisma/TypeORM repository without touching other layers |
| Soft delete | Tasks are never permanently removed — `deleted_at` is set instead, satisfying the bonus requirement |
| Zustand selectors | `selectFilteredTasks` and `selectStatusCounts` are pure functions kept outside the store, avoiding stale derived state |
| Optimistic UI | Create / update / delete mutations update local state immediately without a full refetch |
| Composition Root (`app.ts`) | All `new` calls and dependency wiring are in one place; individual layers remain easily unit-testable |
