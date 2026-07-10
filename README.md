# Sprint Board

A small team task board — three columns (To Do / In Progress / Done), add/edit/delete tasks, move between columns, combined priority + assignee filters, debounced title search, and localStorage persistence. Press **N** anywhere to open the add-task dialog; **Undo** in the header reverts the last board action (up to 20 steps).

**Live:** https://sprint-board-ruby.vercel.app

Built for the Narix Labs frontend intern assignment. The task shape (`status: todo | in_progress | done`, `priority: low | medium | high`) mirrors a REST API I built separately ([sprint-board-api](https://github.com/dahiya001rohit/sprint-board-api)) — this app doesn't call it, per the brief (jsonplaceholder seed + localStorage), but the two share one contract.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

`npm run build` type-checks and produces the production bundle.
`npm test` runs the Vitest suite for the filter/search logic.

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4. No component or state libraries.

## Decisions

**1. `useReducer` + Context as the single source of truth.**
The only stored state is `{ tasks: Task[] }`. Everything else — filtered lists, per-column slices, live counts, the assignee dropdown options — is computed at render time from that array. Counts can't go stale because they're never stored. All five mutations (seed/add/edit/delete/move) live in one pure reducer, so the logic is testable without React and components just announce events.

**2. Filters and search are view state, not board state.**
They live in `useState` at the App level and are applied through pure functions (`utils/filterTasks.ts`). The search input updates instantly but filtering reads a debounced copy (custom `useDebounce`, 300ms) — debounce the consumer, not the input.

**3. Native `<dialog>` for add/edit/delete-confirm popups.**
`showModal()` gives focus trapping, Esc-to-close, and a `::backdrop` for free — no modal library, and keyboard/screen-reader behavior is correct by default.

**4. Seeding runs only on a truly first visit.**
The provider captures whether localStorage was empty *at startup*. Checking `tasks.length === 0` instead would re-seed after a user deletes all their tasks. On fetch failure the board stays empty and fully usable, with a dismissible error banner. Seed priorities/assignees derive from each todo's id (modulo), so they're deterministic — never random on render.

## Edge cases handled

Empty board and empty columns, long unbroken titles (flex `min-w-0` + `break-words`), duplicate assignee names (deduped via `Set` for the filter), failed seed fetch, corrupt localStorage JSON (falls back to empty), 80-char title cap enforced on both the form and API data.

## With more time

- **Redo** — undo keeps a history stack; a `future` stack mirroring it would complete the pair.
- **More tests** — filter/search and the reducer's undo path are covered; the remaining reducer actions would be next.
- **Swap localStorage for my sprint-board-api** so boards are shared between users.
- Native HTML5 drag-and-drop on top of the move dropdown (keeping the dropdown as the accessible fallback).
