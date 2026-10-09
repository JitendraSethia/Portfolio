import { useState, type ReactNode } from 'react';
import { THEMES, THEME_NAMES } from '../data/themes';
import type { Obj } from './api';

/** Declarative form schema — every editor tab is described with these. */
export type Field =
  | { kind: 'text' | 'url' | 'textarea'; key: string; label: string; help?: string; placeholder?: string; required?: boolean; optional?: boolean; rows?: number; half?: boolean }
  | { kind: 'select'; key: string; label: string; help?: string; options: { value: string; label: string }[]; half?: boolean }
  | { kind: 'theme'; key: string; label: string; help?: string }
  | { kind: 'color'; key: string; label: string; help?: string; half?: boolean }
  | { kind: 'tags'; key: string; label: string; help?: string; placeholder?: string; optional?: boolean }
  | { kind: 'lines'; key: string; label: string; help?: string; addLabel: string; rows?: number }
  | { kind: 'list'; key: string; label: string; help?: string; item: Field[]; title: (v: Obj, i: number) => string; subtitle?: (v: Obj) => string; create: () => Obj; addLabel: string; preview?: (v: Obj) => ReactNode; minItems?: number; note?: (i: number) => string | undefined }
  | { kind: 'group'; key: string; label: string; help?: string; fields: Field[] }
  | { kind: 'order'; key: string; label: string; help?: string; options: { value: string; label: string }[] };

export function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return arr;
  const next = arr.slice();
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

/** Shared drag-to-reorder wiring for any list (HTML5 drag and drop, plus arrow buttons for touch). */
function useReorder(onMove: (from: number, to: number) => void) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const handle = (i: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      setDragging(i);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(i));
    },
    onDragEnd: () => {
      setDragging(null);
      setOver(null);
    },
  });
  const target = (i: number) => ({
    onDragOver: (e: React.DragEvent) => {
      if (dragging === null) return;
      e.preventDefault();
      if (over !== i) setOver(i);
    },
    onDragLeave: () => over === i && setOver(null),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      if (dragging !== null) onMove(dragging, i);
      setDragging(null);
      setOver(null);
    },
    className: over === i && dragging !== i ? 'drag-over' : '',
  });
  return { handle, target, dragging };
}

function Label({ label, help, required }: { label: string; help?: string; required?: boolean }) {
  return (
    <div className="mb-1.5">
      <span className="text-[13px] font-semibold text-bone">
        {label}
        {required && <span className="text-crimson-2"> *</span>}
      </span>
      {help && <p className="mt-0.5 text-xs leading-relaxed text-smoke">{help}</p>}
    </div>
  );
}

export function FieldsEditor({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  const set = (key: string, v: unknown, optional?: boolean) => {
    const next = { ...value };
    if (optional && (v === '' || (Array.isArray(v) && v.length === 0))) delete next[key];
    else next[key] = v;
    onChange(next);
  };
  return (
    <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={'half' in f && f.half ? '' : 'sm:col-span-2'}>
          <FieldInput field={f} value={value[f.key]} onChange={(v) => set(f.key, v, 'optional' in f ? f.optional : false)} />
        </div>
      ))}
    </div>
  );
}

function FieldInput({ field: f, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (f.kind) {
    case 'text':
    case 'url':
      return (
        <label className="block">
          <Label label={f.label} help={f.help} required={f.required} />
          <input
            className="field"
            type={f.kind === 'url' ? 'url' : 'text'}
            value={(value as string) ?? ''}
            placeholder={f.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      );
    case 'textarea':
      return (
        <label className="block">
          <Label label={f.label} help={f.help} required={f.required} />
          <textarea className="field" rows={f.rows ?? 3} value={(value as string) ?? ''} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
        </label>
      );
    case 'select':
      return (
        <label className="block">
          <Label label={f.label} help={f.help} />
          <select className="field" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)}>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      );
    case 'color':
      return (
        <label className="block">
          <Label label={f.label} help={f.help} />
          <div className="flex items-center gap-2">
            <input type="color" className="h-10 w-12 cursor-pointer rounded-md border border-white/15 bg-ink p-1" value={(value as string) ?? '#e5132b'} onChange={(e) => onChange(e.target.value)} />
            <input className="field" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
          </div>
        </label>
      );
    case 'theme':
      return (
        <div>
          <Label label={f.label} help={f.help} />
          <div className="flex flex-wrap gap-2">
            {THEME_NAMES.map((t) => {
              const p = THEMES[t];
              const active = value === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChange(t)}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-semibold capitalize transition ${active ? 'border-bone text-bone' : 'border-white/10 text-mist hover:border-white/30'}`}
                >
                  <span className="h-5 w-5 rounded" style={{ background: `linear-gradient(135deg, ${p.via}, ${p.from} 60%), ${p.to}`, boxShadow: `inset 0 0 0 2px ${p.accent}` }} />
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      );
    case 'tags':
      return <TagsInput label={f.label} help={f.help} placeholder={f.placeholder} value={(value as string[]) ?? []} onChange={onChange} />;
    case 'lines':
      return <LinesInput field={f} value={(value as string[]) ?? []} onChange={onChange} />;
    case 'group':
      return (
        <fieldset className="rounded-xl border border-white/10 p-4">
          <legend className="px-1 text-[13px] font-semibold text-bone">{f.label}</legend>
          {f.help && <p className="-mt-1 mb-3 text-xs text-smoke">{f.help}</p>}
          <FieldsEditor fields={f.fields} value={(value as Obj) ?? {}} onChange={onChange} />
        </fieldset>
      );
    case 'list':
      return <ListEditor field={f} value={(value as Obj[]) ?? []} onChange={onChange} />;
    case 'order':
      return <OrderInput field={f} value={(value as string[]) ?? []} onChange={onChange} />;
  }
}

function TagsInput({ label, help, placeholder, value, onChange }: { label: string; help?: string; placeholder?: string; value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('');
  const { handle, target } = useReorder((a, b) => onChange(move(value, a, b)));
  const add = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter(Boolean).filter((s) => !value.includes(s));
    if (parts.length) onChange([...value, ...parts]);
    setDraft('');
  };
  return (
    <div>
      <Label label={label} help={help ?? 'Type and press Enter. Drag a chip to reorder.'} />
      <div className="field flex flex-wrap items-center gap-1.5 !py-1.5">
        {value.map((t, i) => (
          <span key={t} {...handle(i)} {...target(i)} className={`inline-flex cursor-grab items-center gap-1 rounded-full bg-ink-4 py-1 pl-3 pr-1 text-xs font-medium text-bone ${target(i).className}`}>
            {t}
            <button type="button" aria-label={`Remove ${t}`} className="flex h-5 w-5 items-center justify-center rounded-full text-mist hover:bg-white/10 hover:text-bone" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              ✕
            </button>
          </span>
        ))}
        <input
          className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-smoke"
          value={draft}
          placeholder={placeholder ?? 'Add…'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add();
            } else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={add}
        />
      </div>
    </div>
  );
}

function LinesInput({ field, value, onChange }: { field: Extract<Field, { kind: 'lines' }>; value: string[]; onChange: (v: string[]) => void }) {
  const { handle, target } = useReorder((a, b) => onChange(move(value, a, b)));
  return (
    <div>
      <Label label={field.label} help={field.help} />
      <div className="space-y-2">
        {value.map((line, i) => (
          <div key={i} {...target(i)} className={`flex items-start gap-1.5 rounded-lg ${target(i).className}`}>
            <span {...handle(i)} title="Drag to reorder" className="mt-2 cursor-grab select-none px-1 text-smoke">
              ⋮⋮
            </span>
            <textarea className="field" rows={field.rows ?? 2} value={line} onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))} />
            <div className="flex flex-col">
              <button type="button" className="icon-btn" disabled={i === 0} aria-label="Move up" onClick={() => onChange(move(value, i, i - 1))}>
                ↑
              </button>
              <button type="button" className="icon-btn" disabled={i === value.length - 1} aria-label="Move down" onClick={() => onChange(move(value, i, i + 1))}>
                ↓
              </button>
            </div>
            <button type="button" className="icon-btn mt-1" aria-label="Remove line" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-ghost mt-2 !min-h-9 text-xs" onClick={() => onChange([...value, ''])}>
        ＋ {field.addLabel}
      </button>
    </div>
  );
}

function OrderInput({ field, value, onChange }: { field: Extract<Field, { kind: 'order' }>; value: string[]; onChange: (v: string[]) => void }) {
  // Keep every known option present, in the saved order first.
  const ids = [...value.filter((v) => field.options.some((o) => o.value === v)), ...field.options.map((o) => o.value).filter((v) => !value.includes(v))];
  const { handle, target } = useReorder((a, b) => onChange(move(ids, a, b)));
  const label = (v: string) => field.options.find((o) => o.value === v)?.label ?? v;
  return (
    <div>
      <Label label={field.label} help={field.help} />
      <ol className="space-y-1.5">
        {ids.map((id, i) => (
          <li key={id} {...target(i)} className={`flex items-center gap-2 rounded-lg border border-white/10 bg-ink px-2 py-1.5 ${target(i).className}`}>
            <span {...handle(i)} className="cursor-grab select-none px-1 text-smoke" title="Drag to reorder">
              ⋮⋮
            </span>
            <span className="w-5 text-xs text-smoke">{i + 1}</span>
            <span className="flex-1 text-sm text-bone">{label(id)}</span>
            <button type="button" className="icon-btn" disabled={i === 0} aria-label="Move up" onClick={() => onChange(move(ids, i, i - 1))}>
              ↑
            </button>
            <button type="button" className="icon-btn" disabled={i === ids.length - 1} aria-label="Move down" onClick={() => onChange(move(ids, i, i + 1))}>
              ↓
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ListEditor({ field, value, onChange }: { field: Extract<Field, { kind: 'list' }>; value: Obj[]; onChange: (v: Obj[]) => void }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const { handle, target, dragging } = useReorder((a, b) => {
    onChange(move(value, a, b));
    setOpen(new Set());
  });
  const toggle = (i: number) => setOpen((s) => (s.has(i) ? new Set([...s].filter((x) => x !== i)) : new Set([...s, i])));
  const remove = (i: number) => {
    if (!confirm(`Delete "${field.title(value[i], i) || 'this item'}"? You can still undo by not publishing.`)) return;
    onChange(value.filter((_, j) => j !== i));
    setOpen(new Set());
  };
  const add = () => {
    onChange([...value, field.create()]);
    setOpen(new Set([value.length]));
  };
  const canRemove = value.length > (field.minItems ?? 0);

  return (
    <div>
      {field.label && <Label label={field.label} help={field.help} />}
      <ul className="space-y-2">
        {value.map((item, i) => {
          const isOpen = open.has(i);
          const note = field.note?.(i);
          return (
            <li key={i} {...target(i)} className={`overflow-hidden rounded-xl border bg-ink-2 transition ${isOpen ? 'border-white/20' : 'border-white/10'} ${dragging === i ? 'opacity-40' : ''} ${target(i).className}`}>
              <div className="flex items-center gap-1 pr-1.5">
                <span {...handle(i)} className="cursor-grab select-none self-stretch px-3 py-3 text-smoke hover:text-bone" title="Drag to reorder">
                  ⋮⋮
                </span>
                <button type="button" onClick={() => toggle(i)} className="flex min-w-0 flex-1 items-center gap-3 py-2.5 text-left">
                  {field.preview && <span className="hidden shrink-0 sm:block">{field.preview(item)}</span>}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-bone">
                      {field.title(item, i) || <span className="italic text-smoke">Untitled</span>}
                      {note && <span className="ml-2 rounded bg-crimson/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-crimson-2">{note}</span>}
                    </span>
                    {field.subtitle && <span className="block truncate text-xs text-smoke">{field.subtitle(item)}</span>}
                  </span>
                </button>
                <button type="button" className="icon-btn" disabled={i === 0} aria-label="Move up" onClick={() => onChange(move(value, i, i - 1))}>
                  ↑
                </button>
                <button type="button" className="icon-btn" disabled={i === value.length - 1} aria-label="Move down" onClick={() => onChange(move(value, i, i + 1))}>
                  ↓
                </button>
                <button type="button" className="icon-btn" disabled={!canRemove} aria-label="Delete" onClick={() => remove(i)}>
                  🗑
                </button>
                <button type="button" className="icon-btn" aria-label={isOpen ? 'Collapse' : 'Edit'} onClick={() => toggle(i)}>
                  {isOpen ? '▴' : '▾'}
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-white/10 p-4">
                  <FieldsEditor fields={field.item} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <button type="button" className="btn btn-ghost mt-3" onClick={add}>
        ＋ {field.addLabel}
      </button>
    </div>
  );
}
