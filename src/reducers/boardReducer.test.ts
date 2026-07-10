import { describe, expect, it } from "vitest";
import { boardReducer, type BoardState } from "./boardReducer";
import type { Task } from "../types/task";

const task: Task = {
  id: "t1",
  title: "Fix login bug",
  description: "",
  priority: "high",
  assignee: "Asha",
  status: "todo",
  createdAt: 0,
};

const empty: BoardState = { tasks: [], past: [] };

describe("boardReducer UNDO", () => {
  it("restores the previous tasks after a mutation", () => {
    const added = boardReducer(empty, { type: "ADD", task });
    expect(added.tasks).toHaveLength(1);

    const undone = boardReducer(added, { type: "UNDO" });
    expect(undone.tasks).toEqual([]);
    expect(undone.past).toEqual([]);
  });

  it("undoes step by step through multiple mutations", () => {
    const added = boardReducer(empty, { type: "ADD", task });
    const moved = boardReducer(added, { type: "MOVE", id: "t1", status: "done" });
    expect(moved.tasks[0].status).toBe("done");

    const undoMove = boardReducer(moved, { type: "UNDO" });
    expect(undoMove.tasks[0].status).toBe("todo"); // move reverted, task still there
  });

  it("is a no-op when history is empty", () => {
    expect(boardReducer(empty, { type: "UNDO" })).toBe(empty); // same reference — no re-render churn
  });

  it("does not record SEED in history", () => {
    const seeded = boardReducer(empty, { type: "SEED", tasks: [task] });
    expect(seeded.past).toEqual([]);
  });
});
