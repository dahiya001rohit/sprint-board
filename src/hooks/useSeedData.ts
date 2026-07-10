import { useEffect, useState } from "react";
import { useBoard } from "../context/BoardContext";
import { mapTodos, type ApiTodo } from "../utils/mapTodos";

const SEED_URL = "https://jsonplaceholder.typicode.com/todos?_limit=12";

// First-visit seeding: fetch → map → dispatch SEED. Skipped entirely when
// storage already had data. On failure the board stays empty but fully usable.
export function useSeedData() {
  const { dispatch, storageWasEmpty } = useBoard();
  const [loading, setLoading] = useState(storageWasEmpty); // returning visits never load
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storageWasEmpty) return;

    // AbortController: cancel the request if the component unmounts mid-fetch,
    // so we never dispatch/setState on an unmounted tree.
    const controller = new AbortController();

    fetch(SEED_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`); // fetch only rejects on network errors, not 4xx/5xx
        return res.json();
      })
      .then((todos: ApiTodo[]) => dispatch({ type: "SEED", tasks: mapTodos(todos) }))
      .catch(() => {
        if (!controller.signal.aborted) setError("Couldn't load sample tasks. You can still add your own.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [storageWasEmpty, dispatch]);

  return { loading, error, dismissError: () => setError(null) };
}
