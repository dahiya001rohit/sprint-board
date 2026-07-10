import { useEffect } from "react";

// Read once at startup (used as the reducer's lazy initializer).
// try/catch: storage can hold corrupt JSON or be blocked (private mode) — fall back to null.
export function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// Write-on-change side of persistence: whenever `value` changes, sync it to storage.
// Effect (not render) because writing storage is a side effect — must not run during render.
export function useLocalStorage<T>(key: string, value: T) {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
}
