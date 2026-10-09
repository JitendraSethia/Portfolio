import { useState } from 'react';
import type { Obj } from './api';
import { processPhoto, type PhotoResult } from './photo';

export type StagedAsset = { path: string; blob: Blob; label: string };

const MAX_PDF = 2.5 * 1024 * 1024;
const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export default function Media({ profile, staged, onStage }: { profile: Obj; staged: StagedAsset[]; onStage: (assets: StagedAsset[]) => void }) {
  const [photo, setPhoto] = useState<PhotoResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const resumePath = `public${profile.resumePdf ?? '/assets/resume.pdf'}`;
  const photoStaged = staged.some((a) => a.path.includes('portrait-'));
  const resumeStaged = staged.find((a) => a.path === resumePath);

  const pickPhoto = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      setPhoto(
        await processPhoto(file, {
          title: profile.firstName ?? '',
          series: profile.seriesTag ?? 'THE SERIES',
          tagline: [profile.role, ...(profile.tagline ?? []).slice(1)].filter(Boolean).join(' • '),
        }),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const usePhoto = () => {
    if (!photo) return;
    const others = staged.filter((a) => !a.path.includes('portrait-') && !a.path.endsWith('og-image.jpg'));
    onStage([...others, ...photo.files.map((f) => ({ ...f, label: 'Photo' }))]);
  };

  const pickResume = (file?: File) => {
    if (!file) return;
    setError('');
    if (file.type !== 'application/pdf') return setError('The resume must be a PDF.');
    if (file.size > MAX_PDF) return setError(`That PDF is ${kb(file.size)} — please keep it under 2.5 MB.`);
    onStage([...staged.filter((a) => a.path !== resumePath), { path: resumePath, blob: file, label: `Resume (${file.name})` }]);
  };

  return (
    <div className="space-y-8">
      {error && <p className="rounded-lg bg-crimson/15 px-3 py-2 text-sm text-crimson-2">{error}</p>}

      <section className="rounded-2xl border border-white/10 bg-ink-2 p-5">
        <h3 className="text-base font-semibold text-bone">Your photo</h3>
        <p className="mt-1 text-sm leading-relaxed text-mist">
          A head-and-shoulders photo on a plain, light background works best — the background is removed automatically. A PNG that’s already transparent is used as it is.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <img src="/assets/portrait-420.webp" alt="Current portrait" className="h-28 w-auto rounded-lg bg-[radial-gradient(circle_at_50%_30%,#5a0b1b,#07070a)] object-contain" />
          <label className="btn btn-ghost cursor-pointer">
            {busy ? 'Processing…' : 'Choose a new photo'}
            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" disabled={busy} onChange={(e) => pickPhoto(e.target.files?.[0])} />
          </label>
          {photoStaged && <span className="text-sm font-semibold text-ok">✓ New photo ready to publish</span>}
        </div>

        {photo && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-mist">
              {photo.removedBackground ? 'Background removed. Check the edges look clean:' : 'Your photo was already transparent, so it’s used as is:'}
            </p>
            <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
              <img src={photo.cutoutUrl} alt="Cutout preview" className="h-64 w-auto rounded-xl bg-[radial-gradient(circle_at_50%_30%,#5a0b1b,#07070a)] object-contain" />
              <div>
                <img src={photo.ogUrl} alt="Share image preview" className="w-full max-w-lg rounded-xl ring-1 ring-white/10" />
                <p className="mt-1 text-xs text-smoke">Preview shown when your link is shared on WhatsApp, LinkedIn…</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-primary" onClick={usePhoto}>
                Use this photo
              </button>
              <button className="btn btn-ghost" onClick={() => setPhoto(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-ink-2 p-5">
        <h3 className="text-base font-semibold text-bone">Resume (PDF)</h3>
        <p className="mt-1 text-sm leading-relaxed text-mist">Replaces the resume people view and download. Max 2.5 MB.</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <a href={profile.resumePdf} target="_blank" rel="noreferrer" className="text-sm text-mist underline underline-offset-4 hover:text-bone">
            View current resume ↗
          </a>
          <label className="btn btn-ghost cursor-pointer">
            Choose a PDF
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => pickResume(e.target.files?.[0])} />
          </label>
          {resumeStaged && (
            <span className="text-sm font-semibold text-ok">
              ✓ {resumeStaged.label} · {kb(resumeStaged.blob.size)} ready to publish
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
