import { useEffect, useState } from "react";

// Returns `value`, but only after it has stopped changing for `delay` ms.
// Each keystroke re-runs the effect; cleanup cancels the previous timer,
// so only the last keystroke's timer survives to fire.
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
