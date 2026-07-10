import { useId } from "react";
import { PRIORITIES, type Priority } from "../types/task";
import type { Filters } from "../utils/filterTasks";

interface FilterBarProps {
  filters: Filters; // raw values — App debounces search before actually filtering
  assignees: string[]; // derived from tasks by App via uniqueAssignees
  onChange: (next: Filters) => void; // App owns the state; bar only reports changes
}

export function FilterBar({ filters, assignees, onChange }: FilterBarProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-1">
        <label htmlFor={`${id}-search`}>Search title</label>
        <input
          id={`${id}-search`}
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Type to search…"
          className="rounded border px-2 py-1"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-priority`}>Priority</label>
        <select
          id={`${id}-priority`}
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value as Priority | "all" })}
          className="rounded border px-2 py-1"
        >
          <option value="all">All</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-assignee`}>Assignee</label>
        <select
          id={`${id}-assignee`}
          value={filters.assignee}
          onChange={(e) => onChange({ ...filters, assignee: e.target.value })}
          className="rounded border px-2 py-1"
        >
          <option value="all">All</option>
          {assignees.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
