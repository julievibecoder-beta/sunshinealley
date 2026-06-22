import { useRef, useState } from "react";
import { Upload, Link2, X, GripVertical } from "lucide-react";
import { fileToDataUrl } from "@/lib/image-upload";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  label?: string;
  max?: number;
};

export function ImageUpload({ value, onChange, multiple = false, label, max }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cap = max ?? (multiple ? Infinity : 1);
  const atLimit = value.length >= cap;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const list = Array.from(files);
      const converted: string[] = [];
      for (const f of list) {
        converted.push(await fileToDataUrl(f));
        if (!multiple) break;
      }
      const merged = multiple ? [...value, ...converted] : converted.slice(0, 1);
      const capped = merged.slice(0, cap);
      if (merged.length > capped.length) {
        setError(`Only ${cap} image${cap === 1 ? "" : "s"} allowed.`);
      }
      onChange(capped);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const addUrl = () => {
    const u = urlDraft.trim();
    if (!u) return;
    if (atLimit && multiple) {
      setError(`Only ${cap} images allowed.`);
      return;
    }
    onChange(multiple ? [...value, u].slice(0, cap) : [u]);
    setUrlDraft("");
  };

  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {label && <span className="block text-sm font-medium">{label}</span>}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((src, i) => (
            <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-md border bg-muted">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 rounded-full bg-background/90 p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
              {multiple && value.length > 1 && (
                <div className="absolute bottom-1 left-1 flex gap-0.5 rounded bg-background/90 px-1 py-0.5 text-[10px] opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                  <button type="button" onClick={() => move(i, -1)} className="px-0.5 hover:text-primary" aria-label="Move left">‹</button>
                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                  <button type="button" onClick={() => move(i, 1)} className="px-0.5 hover:text-primary" aria-label="Move right">›</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy || (atLimit && multiple)}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:border-primary hover:text-primary disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : multiple ? "Upload images" : "Upload image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex flex-1 items-center gap-1">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <input
            type="url"
            placeholder="Paste image URL"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            className="flex-1 rounded-md border bg-card px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={addUrl}
            className="rounded-md border px-2 py-1 text-xs hover:border-primary hover:text-primary"
          >
            Add
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Images are resized to 1200px max and stored locally in this browser.
      </p>
    </div>
  );
}
