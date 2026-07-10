// Mirrors the backend API's task shape (sprint-board-api) so both apps share one contract.

// Union types instead of enums: zero runtime code, and TS narrows them in switch statements.
export type Status = "todo" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string; // crypto.randomUUID() for new tasks, "seed-<id>" for fetched ones
  title: string; // required, max 80 chars (enforced in TaskForm)
  description: string; // optional — empty string when unset, keeps the shape uniform
  priority: Priority;
  assignee: string; // free text
  status: Status;
  createdAt: number; // epoch ms — stable sort order within a column
}

// Single place that knows column order + display labels; Board/Column read from this.
export const STATUSES: { value: Status; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const PRIORITIES: Priority[] = ["low", "medium", "high"];
