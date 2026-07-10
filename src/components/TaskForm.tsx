import { useId, useState } from "react";
import { PRIORITIES, type Priority, type Task } from "../types/task";
import { useBoard } from "../context/BoardContext";

interface TaskFormProps {
  task?: Task; // present → edit mode (prefilled); absent → add mode
  onClose?: () => void; // edit mode: parent hides the form on save/cancel
}

const EMPTY = { title: "", description: "", priority: "medium" as Priority, assignee: "" };

// Shared field styles — one const instead of repeating the string on every input.
const FIELD = "border border-line bg-canvas px-2 py-1.5 text-[13px] text-ink focus:border-accent focus:outline-none";
const LABEL = "text-[11px] font-medium text-dim";

export function TaskForm({ task, onClose }: TaskFormProps) {
  const { dispatch } = useBoard();
  const id = useId(); // unique label/input ids — the form can exist multiple times on screen
  // Draft holds only the four editable fields — never id/status/createdAt,
  // so an EDIT can't smuggle identity fields into the reducer.
  const [draft, setDraft] = useState(
    task
      ? { title: task.title, description: task.description, priority: task.priority, assignee: task.assignee }
      : EMPTY
  );
  const [error, setError] = useState("");

  // Called from onSubmit after preventDefault — no event types needed here.
  function handleSubmit() {
    const title = draft.title.trim();
    if (!title) return setError("Title is required.");

    if (task) {
      dispatch({ type: "EDIT", id: task.id, changes: { ...draft, title } });
    } else {
      dispatch({
        type: "ADD",
        task: { ...draft, title, id: crypto.randomUUID(), status: "todo", createdAt: Date.now() },
      });
      setDraft(EMPTY); // add mode: clear for the next task
    }
    setError("");
    onClose?.();
  }

  // preventDefault stops the native page-reload submit; event type is inferred, no import needed.
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-2"
    >
      <label htmlFor={`${id}-title`} className={LABEL}>
        Title *
      </label>
      <input
        id={`${id}-title`}
        value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        maxLength={80} // hard cap from the brief, enforced natively
        className={FIELD}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}

      <label htmlFor={`${id}-desc`} className={LABEL}>
        Description
      </label>
      <textarea
        id={`${id}-desc`}
        value={draft.description}
        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        rows={2}
        className={FIELD}
      />

      <label htmlFor={`${id}-priority`} className={LABEL}>
        Priority
      </label>
      {/* select values are plain strings; the assertion is safe because options only contain priorities */}
      <select
        id={`${id}-priority`}
        value={draft.priority}
        onChange={(e) => setDraft({ ...draft, priority: e.target.value as Priority })}
        className={FIELD}
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <label htmlFor={`${id}-assignee`} className={LABEL}>
        Assignee
      </label>
      <input
        id={`${id}-assignee`}
        value={draft.assignee}
        onChange={(e) => setDraft({ ...draft, assignee: e.target.value })}
        className={FIELD}
      />

      <div className="mt-2 flex gap-2">
        <button type="submit" className="bg-accent px-3 py-1.5 text-[13px] font-medium text-white hover:opacity-90">
          {task ? "Save" : "Add task"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="border border-line px-3 py-1.5 text-[13px] text-dim hover:text-ink"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
