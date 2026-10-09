import type { ReactNode } from 'react';
import type { Palette, Project } from '../data/portfolio';

/**
 * Generated "key art" for thumbnails — layered gradients, light falloff and a motif.
 * No stock imagery: every card is art-directed from its palette.
 */
export function PosterBackdrop({ palette, children, className = '' }: { palette: Palette; children?: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 85% 10%, ${palette.via} 0%, transparent 60%),
          radial-gradient(90% 80% at 0% 100%, ${palette.from} 0%, transparent 70%),
          linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -right-1/4 -top-1/3 h-[140%] w-[70%] rotate-[18deg] opacity-40 blur-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}55, transparent)` }}
      />
      <div aria-hidden className="absolute inset-0 opacity-[0.18] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_4px)]" />
      {children}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
    </div>
  );
}

/** Motif illustrations for each Original, built from the project's own architecture. */
export function ProjectArt({ project, className = '' }: { project: Project; className?: string }) {
  const a = project.palette.accent;
  return (
    <PosterBackdrop palette={project.palette} className={className}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id={`g-${project.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={a} stopOpacity="0.55" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="290" cy="120" r="130" fill={`url(#g-${project.id})`} />
        {project.motif === 'shield' && (
          <g transform="translate(232 40)" fill="none" stroke={a} strokeOpacity="0.85">
            <path d="M58 0 L116 22 V78 C116 120 90 146 58 160 C26 146 0 120 0 78 V22 Z" strokeWidth="2" />
            <path d="M58 16 L102 33 V78 C102 111 82 132 58 144 C34 132 14 111 14 78 V33 Z" strokeWidth="1" strokeOpacity="0.4" />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1="30" x2={i % 2 ? 72 : 86} y1={56 + i * 14} y2={56 + i * 14} strokeWidth="3" strokeLinecap="round" strokeOpacity={0.35 + i * 0.1} />
            ))}
            <path d="M40 124 l12 12 l26 -28" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {project.motif === 'flow' && (
          <g fill="none" stroke={a}>
            <rect x="200" y="56" width="150" height="94" rx="12" strokeWidth="2" strokeOpacity="0.85" />
            <rect x="214" y="72" width="28" height="20" rx="4" strokeOpacity="0.7" />
            <line x1="214" x2="330" y1="124" y2="124" strokeWidth="3" strokeOpacity="0.4" strokeDasharray="18 8" />
            <g transform="translate(176 196)" fontFamily="Inter" fontSize="10" fill={a} stroke="none" letterSpacing="2">
              <circle cx="16" cy="16" r="16" fill="none" stroke={a} strokeWidth="2" />
              <path d="M34 16 h46" stroke={a} strokeWidth="2" />
              <circle cx="96" cy="16" r="16" fill="none" stroke={a} strokeWidth="2" strokeOpacity="0.8" />
              <path d="M112 8 l38 -22 M112 24 l38 22" stroke={a} strokeWidth="2" strokeOpacity="0.6" />
              <circle cx="166" cy="-18" r="10" fill={a} fillOpacity="0.8" />
              <circle cx="166" cy="50" r="10" fill="none" stroke={a} strokeWidth="2" strokeOpacity="0.5" />
            </g>
          </g>
        )}
        {project.motif === 'tenants' && (
          <g fill="none" stroke={a}>
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={196 + c * 44}
                  y={50 + r * 44}
                  width="34"
                  height="34"
                  rx="7"
                  strokeWidth="1.6"
                  strokeOpacity={0.25 + ((r + c) % 3) * 0.25}
                  fill={(r + c) % 4 === 0 ? a : 'none'}
                  fillOpacity="0.25"
                />
              )),
            )}
            <path d="M188 200 h190" strokeWidth="2" strokeOpacity="0.7" />
            <path d="M188 214 h190" strokeWidth="1" strokeOpacity="0.35" />
            <path d="M188 228 h190" strokeWidth="1" strokeOpacity="0.2" />
          </g>
        )}
        {project.motif === 'chat' && (
          <g fill="none" stroke={a}>
            <rect x="196" y="52" width="150" height="54" rx="16" strokeWidth="2" strokeOpacity="0.85" />
            <path d="M216 106 l-6 18 l22 -18" strokeWidth="2" strokeOpacity="0.85" strokeLinejoin="round" />
            <line x1="214" x2="320" y1="72" y2="72" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />
            <line x1="214" x2="282" y1="88" y2="88" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.3" />
            <rect x="236" y="138" width="140" height="48" rx="16" strokeWidth="1.6" strokeOpacity="0.55" fill={a} fillOpacity="0.12" />
            <path d="M356 186 l6 16 l-22 -16" strokeWidth="1.6" strokeOpacity="0.55" strokeLinejoin="round" />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={282 + i * 16} cy="162" r="4" fill={a} fillOpacity={0.4 + i * 0.25} stroke="none" />
            ))}
            <circle cx="350" cy="56" r="7" fill={a} stroke="none" />
          </g>
        )}
        {project.motif === 'agent' && (
          <g fill="none" stroke={a}>
            <circle cx="290" cy="130" r="30" strokeWidth="2.4" strokeOpacity="0.9" />
            <circle cx="290" cy="130" r="10" fill={a} fillOpacity="0.7" stroke="none" />
            {[0, 1, 2, 3, 4].map((i) => {
              const ang = (i / 5) * Math.PI * 2 - Math.PI / 2;
              const x = 290 + Math.cos(ang) * 92;
              const y = 130 + Math.sin(ang) * 80;
              return (
                <g key={i}>
                  <line x1={290 + Math.cos(ang) * 32} y1={130 + Math.sin(ang) * 32} x2={x} y2={y} strokeWidth="1.4" strokeOpacity="0.45" strokeDasharray="4 4" />
                  <rect x={x - 15} y={y - 11} width="30" height="22" rx="6" strokeWidth="1.8" strokeOpacity="0.8" />
                </g>
              );
            })}
          </g>
        )}
        {project.motif === 'chart' && (
          <g fill="none" stroke={a}>
            {[
              [210, 120, 160, 100, 172],
              [236, 104, 150, 92, 162],
              [262, 130, 176, 118, 186],
              [288, 86, 134, 74, 146],
              [314, 70, 112, 58, 122],
              [340, 50, 96, 40, 108],
            ].map(([x, o, c, hi, lo], i) => (
              <g key={x} strokeOpacity={0.45 + i * 0.09}>
                <line x1={x} x2={x} y1={hi} y2={lo} strokeWidth="1.4" />
                <rect x={x - 8} y={Math.min(o, c)} width="16" height={Math.abs(c - o)} rx="2" strokeWidth="1.8" fill={i % 2 ? a : 'none'} fillOpacity="0.3" />
              </g>
            ))}
            <path d="M196 196 L240 176 L272 186 L310 140 L360 112" strokeWidth="2.4" strokeOpacity="0.9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M188 214 h190" strokeWidth="1" strokeOpacity="0.35" />
          </g>
        )}
      </svg>
    </PosterBackdrop>
  );
}

/** Small fictional platform mark used in the nav and on cards. */
export function SeriesMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg viewBox="0 0 24 32" className="h-[1.1em] w-auto" aria-hidden>
        <path d="M17 4v16.5c0 4.2-2.8 7.3-6.6 7.3-2.6 0-4.6-1.2-5.8-3.2" fill="none" stroke="#e5132b" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="font-sans text-[0.62em] font-bold tracking-[0.36em] text-mist">SERIES</span>
    </span>
  );
}
