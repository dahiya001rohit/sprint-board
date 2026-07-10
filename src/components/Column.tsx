import type { Task } from "../types/task";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  label: string;
  tasks: Task[]; // already filtered to this column's status by Board
}

export function Column({ label, tasks }: ColumnProps) {
  return (
    <section aria-label={label} className="flex flex-col gap-2 rounded-lg bg-gray-100 p-3">
      <h2 className="flex items-center justify-between text-sm font-semibold">
        {label}
        {/* live count: derived from props on every render — never stored anywhere */}
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs">{tasks.length}</span>
      </h2>

      {tasks.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">No tasks</p>
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
