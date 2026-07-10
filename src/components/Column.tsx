import type { Task } from "../types/task";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  label: string;
  tasks: Task[]; // already filtered to this column's status by Board
}

export function Column({ label, tasks }: ColumnProps) {
  return (
    <section aria-label={label} className="flex flex-col gap-2 border border-line bg-panel p-3">
      {/* Linear-style column header: 11px uppercase label, count beside it */}
      <h2 className="flex items-baseline gap-2 text-[11px] font-medium uppercase tracking-wider text-dim">
        {label}
        {/* live count: derived from props on every render — never stored anywhere */}
        <span className="font-normal">{tasks.length}</span>
      </h2>

      {tasks.length === 0 ? (
        <p className="border border-dashed border-line py-6 text-center text-[13px] text-dim">No tasks</p>
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
