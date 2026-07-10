import { useId, useRef, useState } from "react";
import { STATUSES, type Status, type Task } from "../types/task";
import { useBoard } from "../context/BoardContext";
import { TaskForm } from "./TaskForm";

// One card = one task. Move is a dropdown (accessible, no drag library needed);
// Edit opens the same TaskForm used for adding, prefilled, in a modal dialog.
export function TaskCard({ task }: { task: Task }) {
  const { dispatch } = useBoard();
  const dialogRef = useRef<HTMLDialogElement>(null);
  // editing gates the form's mount: closing (Save/Cancel/Esc) unmounts it, so
  // reopening always starts fresh from the task — no stale half-typed draft.
  const [editing, setEditing] = useState(false);
  const moveId = useId();

  function handleDelete() {
    // Native confirm: one line of guard against misclicks; a styled dialog + undo is the "more time" upgrade.
    if (window.confirm("Delete this task?")) dispatch({ type: "DELETE", id: task.id });
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
        <button
          type="button"
          onClick={() => {
            setEditing(true);
            dialogRef.current?.showModal();
          }}
          className="text-xs underline"
        >
          Edit
        </button>
        <button type="button" onClick={handleDelete} className="text-xs text-red-600 underline">
          Delete
        </button>
      </div>

      {/* same modal pattern as App's add dialog; onClose also catches Esc */}
      <dialog
        ref={dialogRef}
        onClose={() => setEditing(false)}
        className="m-auto w-full max-w-sm rounded-lg p-4 backdrop:bg-black/40"
      >
        <h2 className="mb-2 text-sm font-semibold">Edit task</h2>
        {editing && <TaskForm task={task} onClose={() => dialogRef.current?.close()} />}
      </dialog>
    </li>
  );
}
