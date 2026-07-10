import { useRef, useState } from "react";
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
  const { state } = useBoard();
  const { loading, error, dismissError } = useSeedData();

  // View state — which slice of the board you're looking at, not the board itself.
  const [filters, setFilters] = useState<Filters>({ priority: "all", assignee: "all", search: "" });
  const debouncedSearch = useDebounce(filters.search); // input updates instantly, filtering waits 300ms

  // Derived on every render — never stored: the only source of truth is state.tasks.
  const visible = filterTasks(state.tasks, { ...filters, search: debouncedSearch });

  // Native <dialog> owns its open/closed state — a ref to call showModal()/close(),
  // no React state and no re-render needed to toggle it.
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Sprint Board</h1>
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
        >
          Add task
        </button>
      </header>

      {error && <ErrorBanner message={error} onDismiss={dismissError} />}

      {/* showModal() gives focus trap, Esc-to-close and ::backdrop for free */}
      <dialog ref={dialogRef} className="m-auto w-full max-w-sm rounded-lg p-4 backdrop:bg-black/40">
        <h2 className="mb-2 text-sm font-semibold">New task</h2>
        <TaskForm onClose={() => dialogRef.current?.close()} />
      </dialog>

      <FilterBar filters={filters} assignees={uniqueAssignees(state.tasks)} onChange={setFilters} />

      {loading ? <p className="text-sm text-gray-500">Loading sample tasks…</p> : <Board tasks={visible} />}
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
