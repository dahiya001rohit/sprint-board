import { useId, useRef, useState } from "react";
import { STATUSES, type Priority, type Status, type Task } from "../types/task";
import { useBoard } from "../context/BoardContext";
import { TaskForm } from "./TaskForm";

// Priority shown as a small colored dot + label, Linear-style.
const PRIORITY_DOT: Record<Priority, string> = {
  high: "bg-orange-400",
  medium: "bg-yellow-400",
  low: "bg-zinc-500",
};

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
    <li className="flex flex-col gap-2 border border-line bg-card p-3 transition-colors hover:border-line-bright">
      {/* min-w-0 lets the title shrink inside flex so break-words can wrap long titles */}
      <h3 className="min-w-0 break-words text-[13px] font-medium leading-snug">{task.title}</h3>

      {task.description && <p className="break-words text-xs text-dim">{task.description}</p>}

      <div className="flex items-center gap-2 text-[11px] text-dim">
        <span aria-hidden="true" className={`size-1.5 shrink-0 ${PRIORITY_DOT[task.priority]}`} />
        {task.priority}
        {task.assignee && <span className="truncate">· @{task.assignee}</span>}
      </div>

      <div className="flex items-center gap-3 border-t border-line pt-2">
        {/* sr-only: visible label would clutter the card; screen readers still get it */}
        <label htmlFor={moveId} className="sr-only">
          Move task
        </label>
        <select
          id={moveId}
          value={task.status}
          onChange={(e) => dispatch({ type: "MOVE", id: task.id, status: e.target.value as Status })}
          className="border border-line bg-transparent px-1 py-0.5 text-[11px] text-dim focus:border-accent focus:outline-none"
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
          className="ml-auto text-[11px] text-dim hover:text-ink"
        >
          Edit
        </button>
        <button type="button" onClick={handleDelete} className="text-[11px] text-dim hover:text-red-400">
          Delete
        </button>
      </div>

      {/* same modal pattern as App's add dialog; onClose also catches Esc */}
      <dialog
        ref={dialogRef}
        onClose={() => setEditing(false)}
        className="m-auto w-full max-w-sm border border-line bg-panel p-4 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
      >
        <h2 className="mb-3 text-sm font-semibold tracking-tight">Edit task</h2>
        {editing && <TaskForm task={task} onClose={() => dialogRef.current?.close()} />}
      </dialog>
    </li>
  );
}
