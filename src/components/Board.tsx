import { STATUSES, type Task } from "../types/task";
import { Column } from "./Column";

// Receives the filter/search-narrowed list from App and slices it per status.
// Mobile-first: columns stack at 375px, three-track grid from md (768px) up.
export function Board({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {STATUSES.map((s) => (
        <Column key={s.value} label={s.label} tasks={tasks.filter((t) => t.status === s.value)} />
      ))}
    </div>
  );
}
