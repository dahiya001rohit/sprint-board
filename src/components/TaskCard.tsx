import { useId, useState } from "react";
import { STATUSES, type Status, type Task } from "../types/task";
import { useBoard } from "../context/BoardContext";
import { TaskForm } from "./TaskForm";

// One card = one task. Move is a dropdown (accessible, no drag library needed);
// Edit swaps the card for the same TaskForm used for adding, prefilled.
export function TaskCard({ task }: { task: Task }) {
  const { dispatch } = useBoard();
  const [editing, setEditing] = useState(false); // pure view state — stays local, not in reducer
  const moveId = useId();

  if (editing) {
    return (
      <li className="rounded border bg-white p-3">
        <TaskForm task={task} onClose={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-2 rounded border bg-white p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        {/* min-w-0 lets the title shrink inside flex so break-words can wrap long titles */}
        <h3 className="min-w-0 break-words font-medium">{task.title}</h3>
        <span className="shrink-0 text-xs text-gray-500">{task.priority}</span>
      </div>

      {task.description && <p className="break-words text-gray-600">{task.description}</p>}
      {task.assignee && <p className="text-xs text-gray-500">@{task.assignee}</p>}

      <div className="flex items-center gap-2">
        {/* sr-only: visible label would clutter the card; screen readers still get it */}
        <label htmlFor={moveId} className="sr-only">
          Move task
        </label>
        <select
          id={moveId}
          value={task.status}
          onChange={(e) => dispatch({ type: "MOVE", id: task.id, status: e.target.value as Status })}
          className="rounded border px-1 py-0.5 text-xs"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => setEditing(true)} className="text-xs underline">
          Edit
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "DELETE", id: task.id })}
          className="text-xs text-red-600 underline"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
