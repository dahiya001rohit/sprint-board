import type { Status, Task } from "../types/task";

// Single source of truth: only tasks. Filters/search are view state, kept in components.
export interface BoardState {
  tasks: Task[];
}

// Discriminated union — TS narrows the payload type inside each case by `type`.
export type BoardAction =
  | { type: "SEED"; tasks: Task[] } // first-load fetch result
  | { type: "ADD"; task: Task } // caller builds the Task (id/createdAt) — keeps reducer pure
  | { type: "EDIT"; id: string; changes: Partial<Omit<Task, "id" | "createdAt">> }
  | { type: "DELETE"; id: string }
  | { type: "MOVE"; id: string; status: Status };

// Pure function: no mutation, no side effects — always returns new state.
export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "SEED":
      return { tasks: action.tasks };
    case "ADD":
      return { tasks: [action.task, ...state.tasks] }; // newest first
    case "EDIT":
      return {
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, ...action.changes } : t
        ),
      };
    case "DELETE":
      return { tasks: state.tasks.filter((t) => t.id !== action.id) };
    case "MOVE":
      return {
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, status: action.status } : t
        ),
      };
  }
}
