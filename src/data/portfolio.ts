/**
 * Loads the site content from src/content/*.json (edited through /admin) and shapes it for the components.
 * Content lives in the JSON files; this file only adds types, theme colours and computed values
 * (episode codes, counts), so nothing derived ever has to be edited by hand.
 */
import profileJson from '../content/profile.json';
import projectsJson from '../content/projects.json';
import achievementsJson from '../content/achievements.json';
import reposJson from '../content/repos.json';
import skillsJson from '../content/skills.json';
import seasonsJson from '../content/seasons.json';
import topPicksJson from '../content/topPicks.json';
import introSlidesJson from '../content/introSlides.json';
import viewersJson from '../content/viewers.json';
import sectionsJson from '../content/sections.json';

import { MOTIFS, SECTION_IDS, theme, type Motif, type Palette, type SectionId } from './themes';

export { MOTIFS, SECTION_IDS, THEMES, type Motif, type Palette, type SectionId, type ThemeName } from './themes';

const { education: educationJson, experience: experienceJson, ...profileRest } = profileJson;

export const profile = {
  ...profileRest,
  portrait: {
    src: '/assets/portrait-720.webp',
    srcSet: '/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w',
    alt: `Portrait of ${profileRest.displayName}`,
  },
};

export type Education = { school: string; place: string; degree: string; period: string; score: string };
export type Experience = { company: string; role: string; place: string; period: string; points: string[] };
export const education: Education[] = educationJson;
export const experience: Experience[] = experienceJson;

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  /** Omit when there is no public repository — the GitHub button is hidden instead of linking to a 404. */
  github?: string;
  /** Public live demo, if one exists. */
  live?: string;
  /** Shown instead of links for client work that runs inside the client's own accounts. */
  note?: string;
  palette: Palette;
  motif: Motif;
};

type ProjectJson = Omit<Project, 'palette' | 'motif'> & { theme: string; motif: string };
export const projects: Project[] = (projectsJson as ProjectJson[]).map(({ theme: t, motif, ...p }) => ({
  ...p,
  palette: theme(t),
  motif: (MOTIFS as readonly string[]).includes(motif) ? (motif as Motif) : 'flow',
}));

export type Achievement = { id: string; title: string; org: string; detail: string; laurel: string; link?: string };
export const achievements: Achievement[] = achievementsJson;

/** Public, verifiable code — shown as a rail under the achievements. */
export type Credential = { issuer: string; name: string; link: string };
export const repos: Credential[] = reposJson;

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };
type SkillJson = Skill & { usedIn?: string[] };

export const skillCategories: SkillCategory[] = skillsJson.map((c) => ({
  ...c,
  skills: (c.skills as SkillJson[]).map(({ usedIn: _usedIn, ...s }) => s),
}));

/** Where each skill shows up across projects and achievements (shown on hover/tap). */
export const skillEvidence: Record<string, string[]> = Object.fromEntries(
  skillsJson.flatMap((c) => (c.skills as SkillJson[]).filter((s) => s.usedIn?.length).map((s) => [s.name, s.usedIn!])),
);

export type Episode = { code: string; title: string; description: string; tags: string[]; runtime: string; palette: Palette };
export type Season = { number: number; title: string; period: string; synopsis: string; episodes: Episode[] };

const pad = (n: number) => String(n).padStart(2, '0');
export const seasons: Season[] = seasonsJson.map((s, si) => ({
  number: si + 1,
  title: s.title,
  period: s.period,
  synopsis: s.synopsis,
  episodes: s.episodes.map(({ theme: t, ...e }, ei) => ({ ...e, code: `S${pad(si + 1)} E${pad(ei + 1)}`, palette: theme(t) })),
}));

export type TopPick = { label: string; title: string; detail: string; palette: Palette };
export const topPicks: TopPick[] = topPicksJson.map(({ theme: t, ...p }) => ({ ...p, palette: theme(t) }));

/** Slides for the "▶ Play Intro" cinematic sequence. */
export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };
export const introSlides: IntroSlide[] = introSlidesJson;

/** Viewer profile ids come from content, so the admin can rename or add profiles. */
export type ProfileId = string;

export const viewerProfiles: { id: ProfileId; name: string; blurb: string; color: string; glyph?: string; order: SectionId[] }[] =
  viewersJson.map((v) => ({
    ...v,
    // Keep only known sections, then append any the admin left out so no section ever disappears.
    order: [...v.order.filter((id): id is SectionId => (SECTION_IDS as string[]).includes(id)), ...SECTION_IDS.filter((id) => !v.order.includes(id))],
  }));

/** The owner's profile — the first one, shown with the portrait and the MAIN badge. */
export const MAIN_PROFILE: ProfileId = viewerProfiles[0].id;

const episodeCount = seasons.reduce((n, s) => n + s.episodes.length, 0);
const metaText: Record<SectionId, string> = {
  about: 'The Pilot • Who I am',
  journey: `${seasons.length} Seasons • ${episodeCount} Episodes`,
  originals: `${projects.length} Originals`,
  picks: `Top ${topPicks.length} highlights`,
  skills: `${skillCategories.length} Categories`,
  moments: `${achievements.length} Moments • ${repos.length} public repos`,
  story: 'Resume • View & download',
};

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = Object.fromEntries(
  SECTION_IDS.map((id) => {
    const s = (sectionsJson as Record<string, { nav: string; card: string; theme: string }>)[id];
    return [id, { nav: s.nav, card: s.card, meta: metaText[id], palette: theme(s.theme) }];
  }),
) as Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }>;
