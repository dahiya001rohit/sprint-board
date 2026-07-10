interface ErrorBannerProps {
  message: string;
  onDismiss: () => void; // parent owns the error state; banner only reports the click
}

// Non-blocking: rendered above the board, never overlays it — the app stays usable.
// role="alert" makes screen readers announce the message when it appears.
export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div role="alert" className="flex items-center justify-between gap-2 rounded bg-red-100 px-3 py-2 text-sm text-red-800">
      <p>{message}</p>
      <button type="button" onClick={onDismiss} aria-label="Dismiss error" className="font-bold">
        ✕
      </button>
    </div>
  );
}
