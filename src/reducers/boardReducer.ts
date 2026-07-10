import type { Status, Task } from "../types/task";

// Single source of truth: tasks + undo history. Filters/search are view state, kept in components.
export interface BoardState {
  tasks: Task[];
  past: Task[][]; // previous `tasks` snapshots, newest first — just kept references, no copying
}

const HISTORY_CAP = 20; // keeps localStorage small; 20 undos is plenty

// Every user mutation goes through this: new tasks in, old tasks pushed onto history.
function remember(state: BoardState, tasks: Task[]): BoardState {
  return { tasks, past: [state.tasks, ...state.past].slice(0, HISTORY_CAP) };
}

// Discriminated union — TS narrows the payload type inside each case by `type`.
export type BoardAction =
  | { type: "SEED"; tasks: Task[] } // first-load fetch result
  | { type: "ADD"; task: Task } // caller builds the Task (id/createdAt) — keeps reducer pure
  | { type: "EDIT"; id: string; changes: Partial<Omit<Task, "id" | "createdAt">> }
  | { type: "DELETE"; id: string }
  | { type: "MOVE"; id: string; status: Status }
  | { type: "UNDO" };

// Pure function: no mutation, no side effects — always returns new state.
export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "SEED":
      return { ...state, tasks: action.tasks }; // seeding isn't a user action — nothing to undo
    case "ADD":
      return remember(state, [action.task, ...state.tasks]); // newest first
    case "EDIT":
      return remember(
        state,
        state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.changes } : t))
      );
    case "DELETE":
      return remember(
        state,
        state.tasks.filter((t) => t.id !== action.id)
      );
    case "MOVE":
      return remember(
        state,
        state.tasks.map((t) => (t.id === action.id ? { ...t, status: action.status } : t))
      );
    case "UNDO": {
      const [prev, ...rest] = state.past;
      return prev ? { tasks: prev, past: rest } : state; // no-op when history is empty
    }
  }
}
