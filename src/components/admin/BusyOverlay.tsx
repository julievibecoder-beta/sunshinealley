import { Loader2 } from "lucide-react";

export function BusyOverlay({ show, label = "Saving…" }: { show: boolean; label?: string }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl border bg-card px-5 py-4 shadow-lg">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
