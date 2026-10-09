/** Shared between the site and /admin: the choices the admin offers and how the site draws them. */

export type Palette = { from: string; via: string; to: string; accent: string };

/** Named colour themes — the admin picks one of these names. */
export const THEMES = {
  crimson: { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' },
  amber: { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' },
  ocean: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
  violet: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
  jade: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
} satisfies Record<string, Palette>;
export type ThemeName = keyof typeof THEMES;
export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];
export const theme = (name: string): Palette => THEMES[name as ThemeName] ?? THEMES.crimson;

/** Project poster artwork styles (drawn in components/Poster.tsx). */
export const MOTIFS = ['shield', 'flow', 'tenants', 'chat', 'agent', 'chart'] as const;
export type Motif = (typeof MOTIFS)[number];

export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';
export const SECTION_IDS: SectionId[] = ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'];
