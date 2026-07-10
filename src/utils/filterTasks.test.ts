import { describe, expect, it } from "vitest";
import { filterTasks, uniqueAssignees, type Filters } from "./filterTasks";
import type { Task } from "../types/task";

// Factory: a valid task with overridable fields — keeps each case to one line.
function makeTask(overrides: Partial<Task>): Task {
  return {
    id: "t1",
    title: "Fix login bug",
    description: "",
    priority: "medium",
    assignee: "Asha",
    status: "todo",
    createdAt: 0,
    ...overrides,
  };
}

const ALL: Filters = { priority: "all", assignee: "all", search: "" };

const tasks = [
  makeTask({ id: "1", title: "Fix login bug", priority: "high", assignee: "Asha" }),
  makeTask({ id: "2", title: "Update README", priority: "low", assignee: "Ravi" }),
  makeTask({ id: "3", title: "Fix logout bug", priority: "high", assignee: "Ravi" }),
  makeTask({ id: "4", title: "Design review", priority: "medium", assignee: "Asha" }),
];

describe("filterTasks", () => {
  it("returns everything when all filters are inactive", () => {
    expect(filterTasks(tasks, ALL)).toHaveLength(4);
  });

  it("filters by priority", () => {
    expect(filterTasks(tasks, { ...ALL, priority: "high" }).map((t) => t.id)).toEqual(["1", "3"]);
  });

  it("combines priority AND assignee", () => {
    expect(filterTasks(tasks, { ...ALL, priority: "high", assignee: "Ravi" }).map((t) => t.id)).toEqual(["3"]);
  });

  it("searches title case-insensitively", () => {
    expect(filterTasks(tasks, { ...ALL, search: "FIX" })).toHaveLength(2);
  });

  it("ignores surrounding whitespace in the search query", () => {
    expect(filterTasks(tasks, { ...ALL, search: "  readme  " }).map((t) => t.id)).toEqual(["2"]);
  });

  it("combines all three filters", () => {
    expect(filterTasks(tasks, { priority: "high", assignee: "Asha", search: "fix" }).map((t) => t.id)).toEqual(["1"]);
  });

  it("returns empty for an empty board", () => {
    expect(filterTasks([], { ...ALL, priority: "high" })).toEqual([]);
  });
});

describe("uniqueAssignees", () => {
  it("dedupes duplicate names and sorts", () => {
    expect(uniqueAssignees(tasks)).toEqual(["Asha", "Ravi"]);
  });

  it("drops tasks with no assignee", () => {
    expect(uniqueAssignees([makeTask({ assignee: "" })])).toEqual([]);
  });
});
