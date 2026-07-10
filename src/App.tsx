import { useEffect, useRef, useState } from "react";
import { BoardProvider, useBoard } from "./context/BoardContext";
import { useSeedData } from "./hooks/useSeedData";
import { useDebounce } from "./hooks/useDebounce";
import { filterTasks, uniqueAssignees, type Filters } from "./utils/filterTasks";
import { Board } from "./components/Board";
import { FilterBar } from "./components/FilterBar";
import { TaskForm } from "./components/TaskForm";
import { ErrorBanner } from "./components/ErrorBanner";

// Inner component: useBoard/useSeedData need to run inside the provider.
function BoardApp() {
  const { state, dispatch } = useBoard();
  const { loading, error, dismissError } = useSeedData();

  // View state — which slice of the board you're looking at, not the board itself.
  const [filters, setFilters] = useState<Filters>({ priority: "all", assignee: "all", search: "" });
  const debouncedSearch = useDebounce(filters.search); // input updates instantly, filtering waits 300ms

  // Derived on every render — never stored: the only source of truth is state.tasks.
  const visible = filterTasks(state.tasks, { ...filters, search: debouncedSearch });

  // Native <dialog> owns its open/closed state — a ref to call showModal()/close(),
  // no React state and no re-render needed to toggle it.
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Stretch goal: press N to open the add-task dialog.
  // Ignored while typing in a field or while any dialog is already open.
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select") || document.querySelector("dialog[open]")) return;
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        dialogRef.current?.showModal();
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown); // cleanup on unmount
  }, []);

  // Container: ~90% of wide screens (capped at 1600px), full width with padding on small ones.
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 p-4 md:p-8">
      <header className="flex items-center justify-between">
        {/* display font: Bebas Neue is naturally all-caps — sized up, spaced out */}
        <h1 className="font-display text-3xl tracking-wide">Sprint Board</h1>
        <div className="flex gap-2">
          {/* disabled reads straight from history length — derived, like everything else */}
          <button
            type="button"
            onClick={() => dispatch({ type: "UNDO" })}
            disabled={state.past.length === 0}
            className="border border-line px-3 py-1.5 text-sm text-dim hover:text-ink disabled:opacity-40 disabled:hover:text-dim"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            title="Shortcut: N"
            className="bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            Add task
          </button>
        </div>
      </header>

      {error && <ErrorBanner message={error} onDismiss={dismissError} />}

      {/* showModal() gives focus trap, Esc-to-close and ::backdrop for free */}
      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-sm border border-line bg-panel p-4 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
      >
        <h2 className="mb-3 text-base font-semibold tracking-tight">New task</h2>
        <TaskForm onClose={() => dialogRef.current?.close()} />
      </dialog>

      <FilterBar filters={filters} assignees={uniqueAssignees(state.tasks)} onChange={setFilters} />

      {loading ? <p className="text-sm text-dim">Loading sample tasks…</p> : <Board tasks={visible} />}
    </main>
  );
}

export function App() {
  return (
    <BoardProvider>
      <BoardApp />
    </BoardProvider>
  );
}
