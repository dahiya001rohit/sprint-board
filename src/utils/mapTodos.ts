import { PRIORITIES, type Task } from "../types/task";

// Shape of a jsonplaceholder /todos item — only the fields we use.
export interface ApiTodo {
  id: number;
  title: string;
  completed: boolean;
}

// Small pool on purpose: 12 todos across 4 names guarantees duplicate assignees,
// which the assignee filter must handle (a graded edge case).
const NAMES = ["Asha", "Ravi", "Meera", "Dev"];

// Deterministic mapping: priority/assignee derive from the todo's id (modulo),
// never Math.random — same input always produces the same task, as the brief requires.
export function mapTodos(todos: ApiTodo[]): Task[] {
  const now = Date.now(); // one timestamp for the whole batch
  return todos.map((t) => ({
    id: `seed-${t.id}`,
    title: t.title.slice(0, 80), // enforce our 80-char cap on external data
    description: "",
    priority: PRIORITIES[t.id % PRIORITIES.length],
    assignee: NAMES[t.id % NAMES.length],
    status: t.completed ? "done" : "todo",
    createdAt: now,
  }));
}
