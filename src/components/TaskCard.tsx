import { useId, useRef, useState } from "react";
import { STATUSES, type Priority, type Status, type Task } from "../types/task";
import { useBoard } from "../context/BoardContext";
import { TaskForm } from "./TaskForm";

// Priority shown as a small colored dot + label, Linear-style.
const PRIORITY_DOT: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-blue-500",
  low: "bg-green-500",
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

  // Separate small dialog guards against misclick deletes (replaces window.confirm).
  const deleteRef = useRef<HTMLDialogElement>(null);

  return (
    <li className="flex flex-col gap-2 border border-line bg-card p-3 transition-colors hover:border-line-bright">
      {/* min-w-0 lets the title shrink inside flex so break-words can wrap long titles */}
      <div className="flex items-center justify-between gap-2 text-sm">
        <h3 className="min-w-0 break-words text-lg font-medium uppercase leading-snug">{task.title}</h3>
        <div className="flex items-center gap-2 text-dim uppercase">
          <span aria-hidden="true" className={`size-1.5 shrink-0 ${PRIORITY_DOT[task.priority]}`} />
          <p>{task.priority}</p>
        </div>
      </div>
      {task.description && <p className="break-words text-[13px] text-dim">{task.description}</p>}
      {task.assignee && <span className="truncate text-sm text-dim">@{task.assignee}</span>}

      <div className="flex items-center gap-3 border-t border-line pt-2">
        {/* sr-only: visible label would clutter the card; screen readers still get it */}
        <label htmlFor={moveId} className="sr-only">
          Move task
        </label>
        <select
          id={moveId}
          value={task.status}
          onChange={(e) => dispatch({ type: "MOVE", id: task.id, status: e.target.value as Status })}
          className="border border-line bg-transparent px-1 py-0.5 text-sm text-dim focus:border-accent focus:outline-none"
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
          className="ml-auto text-sm text-dim hover:text-ink"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => deleteRef.current?.showModal()}
          className="text-sm text-dim hover:text-red-400"
        >
          Delete
        </button>
      </div>

      {/* same modal pattern as App's add dialog; onClose also catches Esc */}
      <dialog
        ref={dialogRef}
        onClose={() => setEditing(false)}
        className="m-auto w-full max-w-sm border border-line bg-panel p-4 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
      >
        <h2 className="mb-3 text-base font-semibold tracking-tight">Edit task</h2>
        {editing && <TaskForm task={task} onClose={() => dialogRef.current?.close()} />}
      </dialog>
      {/* delete confirm — Cancel is first so it takes the dialog's initial focus (safe default) */}
      <dialog
        ref={deleteRef}
        className="m-auto w-full max-w-xs border border-line bg-panel p-4 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
      >
        <p className="text-sm">
          Delete “<span className="font-medium">{task.title}</span>”?
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => deleteRef.current?.close()}
            className="border border-line px-3 py-1.5 text-sm text-dim hover:text-ink"
          >
            Cancel
          </button>
          {/* deleting unmounts the card; the open dialog is removed with it — no close() needed */}
          <button
            type="button"
            onClick={() => dispatch({ type: "DELETE", id: task.id })}
            className="bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </dialog>
    </li>
  );
}
