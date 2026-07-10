import type { Priority, Task } from "../types/task";

// View state, not board state — lives in App, never in the reducer.
// "all" is the inactive sentinel for the two dropdowns.
export interface Filters {
  priority: Priority | "all";
  assignee: string; // "all" or an exact assignee name
  search: string; // already-debounced title query
}

// Pure AND-combine: a task must pass every active filter.
// Called at render time — filtered lists are derived, never stored in state.
export function filterTasks(tasks: Task[], f: Filters): Task[] {
  const q = f.search.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      (f.priority === "all" || t.priority === f.priority) &&
      (f.assignee === "all" || t.assignee === f.assignee) &&
      (q === "" || t.title.toLowerCase().includes(q))
  );
}

// Options for the assignee dropdown: Set collapses duplicate names,
// filter(Boolean) drops unassigned tasks, sort keeps the list stable.
export function uniqueAssignees(tasks: Task[]): string[] {
  return [...new Set(tasks.map((t) => t.assignee).filter(Boolean))].sort();
}
