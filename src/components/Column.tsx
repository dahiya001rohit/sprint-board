import type { Status, Task } from "../types/task";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  status: Status;
  label: string;
  tasks: Task[]; // already filtered to this column's status by Board
}

// Status dot per column, Linear-style: gray = todo, yellow = active, green = done.
const STATUS_DOT: Record<Status, string> = {
  todo: "bg-red-500",
  in_progress: "bg-orange-500",
  done: "bg-green-500",
};

export function Column({ status, label, tasks }: ColumnProps) {
  return (
    <section aria-label={label} className="flex flex-col gap-2 border border-line bg-panel p-3">
      <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-dim">
        <span aria-hidden="true" className={`size-1.5 ${STATUS_DOT[status]}`} />
        {label}
        {/* live count: derived from props on every render — never stored anywhere */}
        <span className="font-normal">{tasks.length}</span>
      </h2>

      {tasks.length === 0 ? (
        <p className="border border-dashed border-line py-6 text-center text-sm text-dim">No tasks</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </ul>
      )}
    </section>
  );
}
