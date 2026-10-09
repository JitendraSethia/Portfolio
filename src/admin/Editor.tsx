import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, ApiError, type ContentFiles, type FileName, type Obj } from './api';
import { FieldsEditor, ListEditor } from './fields';
import Media, { type StagedAsset } from './Media';
import { blobToBase64 } from './photo';
import { finalize, findProblems, TABS } from './schema';

const DRAFT_KEY = 'portfolio-admin-draft';
const MAX_REQUEST = 4 * 1024 * 1024; // Vercel's limit is 4.5 MB per request
type Draft = { sha: string; files: ContentFiles; savedAt: number };

function readDraft(): Draft | null {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null');
  } catch {
    return null;
  }
}
function writeDraft(d: Draft | null) {
  try {
    if (d) localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* storage unavailable — drafts are a convenience only */
  }
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export default function Editor({ onLogout }: { onLogout: () => void }) {
  const [sha, setSha] = useState('');
  const [saved, setSaved] = useState<ContentFiles | null>(null);
  const [draft, setDraft] = useState<ContentFiles | null>(null);
  const [assets, setAssets] = useState<StagedAsset[]>([]);
  const [tab, setTab] = useState(TABS[0].id);
  const [loadError, setLoadError] = useState('');
  const [restore, setRestore] = useState<Draft | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const { sha, files } = await api.load();
      setSha(sha);
      setSaved(files);
      setDraft(files);
      setAssets([]);
      const d = readDraft();
      if (d && d.sha === sha && !same(d.files, files)) setRestore(d);
      else if (d) writeDraft(null);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return onLogout();
      setLoadError((e as Error).message);
    }
  }, [onLogout]);

  useEffect(() => {
    load();
  }, [load]);

  const changed = useMemo(() => (saved && draft ? (Object.keys(draft) as FileName[]).filter((k) => !same(draft[k], saved[k])) : []), [saved, draft]);
  const dirty = changed.length > 0 || assets.length > 0;

  // Keep an autosaved draft so a closed tab doesn't lose work.
  useEffect(() => {
    if (!draft || !sha || restore) return;
    const t = setTimeout(() => writeDraft(changed.length ? { sha, files: draft, savedAt: Date.now() } : null), 400);
    return () => clearTimeout(t);
  }, [draft, sha, changed.length, restore]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const setFile = (name: FileName, value: unknown) => setDraft((d) => (d ? { ...d, [name]: value } : d));

  const publish = async () => {
    if (!draft) return;
    const problems = TABS.filter((t) => t.file && changed.includes(t.file)).flatMap((t) => findProblems(t.root, draft[t.file!], t.label));
    if (problems.length) {
      setNotice({ kind: 'error', text: `Fill these in first: ${problems.slice(0, 4).join(' · ')}${problems.length > 4 ? ` · and ${problems.length - 4} more` : ''}` });
      return;
    }
    setPublishing(true);
    setNotice(null);
    try {
      const files = Object.fromEntries(changed.map((k) => [k, finalize(k, draft[k])])) as Partial<ContentFiles>;
      const encoded = await Promise.all(assets.map(async (a) => ({ path: a.path, base64: await blobToBase64(a.blob) })));
      const size = JSON.stringify(files).length + encoded.reduce((n, a) => n + a.base64.length, 0);
      if (size > MAX_REQUEST) throw new Error('This publish is too large in one go. Publish the photo and the resume separately.');
      const res = await api.publish({ files, assets: encoded, baseSha: sha });
      const next = { ...draft, ...files } as ContentFiles;
      setSha(res.sha);
      setSaved(next);
      setDraft(next);
      setAssets([]);
      writeDraft(null);
      setNotice({ kind: 'ok', text: 'Published! Your site updates in about a minute.' });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return onLogout();
      setNotice({ kind: 'error', text: (e as Error).message });
    } finally {
      setPublishing(false);
    }
  };

  const discard = () => {
    if (!confirm('Discard all unpublished changes?')) return;
    setDraft(saved);
    setAssets([]);
    writeDraft(null);
    setNotice(null);
  };

  const logout = async () => {
    if (dirty && !confirm('You have unpublished changes. Log out anyway? (Text changes stay saved in this browser.)')) return;
    await api.logout().catch(() => {});
    onLogout();
  };

  if (loadError)
    return (
      <Center>
        <p className="text-crimson-2">{loadError}</p>
        <button className="btn btn-ghost mt-4" onClick={load}>
          Try again
        </button>
      </Center>
    );
  if (!draft || !saved) return <Center>Loading your content…</Center>;

  const current = TABS.find((t) => t.id === tab);
  const tabDirty = (id: string) => {
    const t = TABS.find((x) => x.id === id);
    return t?.file ? changed.includes(t.file) : id === 'media' && assets.length > 0;
  };

  return (
    <div className="min-h-screen pb-28">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-ink/90 px-4 py-3 backdrop-blur sm:px-6">
        <p className="font-display text-2xl leading-none tracking-wide text-bone">
          <span className="text-crimson">J</span> SERIES <span className="ml-1 font-sans text-[10px] font-bold tracking-[0.3em] text-mist">ADMIN</span>
        </p>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noreferrer" className="btn btn-ghost !min-h-9 text-xs">
            View site ↗
          </a>
          <button className="btn btn-ghost !min-h-9 text-xs" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      {restore && (
        <div className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm sm:mx-6">
          <span className="text-bone">You have unpublished changes from {new Date(restore.savedAt).toLocaleString()}.</span>
          <span className="flex gap-2">
            <button className="btn btn-primary !min-h-9 text-xs" onClick={() => (setDraft(restore.files), setRestore(null))}>
              Restore them
            </button>
            <button className="btn btn-ghost !min-h-9 text-xs" onClick={() => (writeDraft(null), setRestore(null))}>
              Discard
            </button>
          </span>
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:sticky lg:top-20 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0" aria-label="Sections">
          {[...TABS.map((t) => ({ id: t.id, label: t.label, icon: t.icon })), { id: 'media', label: 'Photo & resume', icon: '🖼' }].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${tab === t.id ? 'bg-white/10 text-bone' : 'text-mist hover:bg-white/5 hover:text-bone'}`}
            >
              <span className="w-5 text-center">{t.icon}</span>
              <span className="flex-1 whitespace-nowrap">{t.label}</span>
              {tabDirty(t.id) && <span className="h-2 w-2 rounded-full bg-crimson-2" title="Unpublished changes" />}
            </button>
          ))}
        </nav>

        <main className="min-w-0">
          {current?.file ? (
            <>
              <h1 className="font-display text-4xl tracking-wide text-bone">{current.label}</h1>
              <p className="mb-6 mt-1 text-sm text-mist">{current.intro}</p>
              {current.root.kind === 'list' ? (
                <ListEditor field={current.root} value={draft[current.file] as Obj[]} onChange={(v) => setFile(current.file!, v)} />
              ) : current.root.kind === 'group' ? (
                <FieldsEditor fields={current.root.fields} value={draft[current.file] as Obj} onChange={(v) => setFile(current.file!, v)} />
              ) : null}
            </>
          ) : (
            <>
              <h1 className="font-display text-4xl tracking-wide text-bone">Photo & resume</h1>
              <p className="mb-6 mt-1 text-sm text-mist">Upload a new photo or resume. They go live when you publish.</p>
              <Media profile={draft.profile} staged={assets} onStage={setAssets} />
            </>
          )}
        </main>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink-2/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1 text-sm">
            {notice ? (
              <span className={notice.kind === 'ok' ? 'text-ok' : 'text-crimson-2'}>
                {notice.text}{' '}
                {notice.kind === 'ok' && (
                  <a href="/" target="_blank" rel="noreferrer" className="underline underline-offset-4">
                    Open site ↗
                  </a>
                )}
              </span>
            ) : dirty ? (
              <span className="text-bone">
                Unpublished changes:{' '}
                <span className="text-mist">
                  {[...TABS.filter((t) => t.file && changed.includes(t.file)).map((t) => t.label), ...(assets.length ? [...new Set(assets.map((a) => a.label))] : [])].join(', ')}
                </span>
              </span>
            ) : (
              <span className="text-smoke">Everything is published.</span>
            )}
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost" disabled={!dirty || publishing} onClick={discard}>
              Discard
            </button>
            <button className="btn btn-primary min-w-28" disabled={!dirty || publishing} onClick={publish}>
              {publishing ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center text-sm text-mist">{children}</div>;
}
