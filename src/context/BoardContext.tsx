import { createContext, useContext, useReducer, useState, type Dispatch, type ReactNode } from "react";
import { boardReducer, type BoardAction, type BoardState } from "../reducers/boardReducer";
import { readStorage, useLocalStorage } from "../hooks/useLocalStorage";

const STORAGE_KEY = "sprint-board:tasks";

interface BoardContextValue {
  state: BoardState;
  dispatch: Dispatch<BoardAction>;
  storageWasEmpty: boolean; // captured at startup — seed fetch runs only when true
}

// null default forces usage through the provider (useBoard throws otherwise).
const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  // Lazy useState initializer: reads storage exactly once, on first render.
  const [stored] = useState(() => readStorage<BoardState>(STORAGE_KEY));
  const [state, dispatch] = useReducer(boardReducer, stored ?? { tasks: [] });

  // Persist every state change back to storage.
  useLocalStorage(STORAGE_KEY, state);

  return (
    <BoardContext.Provider value={{ state, dispatch, storageWasEmpty: stored === null }}>
      {children}
    </BoardContext.Provider>
  );
}

// Consumer hook — one import for components instead of useContext + null check everywhere.
// eslint-disable-next-line react-refresh/only-export-components
export function useBoard(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used inside BoardProvider");
  return ctx;
}
