import { MOTIFS, SECTION_IDS, THEMES, type ThemeName } from '../data/themes';
import type { FileName, Obj } from './api';
import type { Field } from './fields';

export type Tab = {
  id: string;
  label: string;
  icon: string;
  file?: FileName;
  intro: string;
  /** For list files: the list editor. For object files: the fields. */
  root: Field;
};

const SECTION_LABELS: Record<string, string> = {
  about: 'About Me',
  journey: 'My Journey (seasons)',
  originals: 'Projects (Originals)',
  picks: 'Top Picks',
  skills: 'Skills',
  moments: 'Achievements & repos',
  story: 'Resume',
};

const themeDot = (t: string) => {
  const p = THEMES[t as ThemeName] ?? THEMES.crimson;
  return <span className="block h-9 w-12 rounded-md" style={{ background: `radial-gradient(120% 90% at 85% 10%, ${p.via}, transparent 60%), linear-gradient(160deg, ${p.from}, ${p.to})`, boxShadow: `inset 0 0 0 1px ${p.accent}55` }} />;
};

const motifLabels: Record<string, string> = {
  shield: 'Shield — security / reliability',
  flow: 'Flow — pipelines & automation',
  tenants: 'Grid — platforms & dashboards',
  chat: 'Chat bubbles — messaging & voice',
  agent: 'Agent hub — AI agents & tools',
  chart: 'Chart — data & trading',
};

const metricsField: Field = {
  kind: 'list',
  key: 'metrics',
  label: 'Result numbers',
  help: 'The big numbers in the project overlay. Keep them honest — targets are not results.',
  title: (m) => (m.value ? `${m.value} — ${m.label ?? ''}` : ''),
  create: () => ({ value: '', label: '' }),
  addLabel: 'Add number',
  item: [
    { kind: 'text', key: 'value', label: 'Number', placeholder: '300+', required: true, half: true },
    { kind: 'text', key: 'label', label: 'What it measures', placeholder: 'videos per month', required: true, half: true },
  ],
};

export const TABS: Tab[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    file: 'profile',
    intro: 'Your name, intro and links — shown in the hero, About, resume sheet and footer.',
    root: {
      kind: 'group',
      key: '',
      label: '',
      fields: [
        { kind: 'text', key: 'fullName', label: 'Full name', required: true, half: true },
        { kind: 'text', key: 'displayName', label: 'Display name', help: 'Used in the footer, About card and page text.', required: true, half: true },
        { kind: 'text', key: 'firstName', label: 'Hero title', help: 'The giant word on the opening and hero. Capitals look best.', required: true, half: true },
        { kind: 'text', key: 'seriesTag', label: 'Subtitle under the hero title', placeholder: 'THE SERIES', half: true },
        { kind: 'text', key: 'originalLabel', label: 'Opening studio card', placeholder: 'A SETHIA ORIGINAL', half: true },
        { kind: 'text', key: 'role', label: 'Role', placeholder: 'AI Automation Engineer', required: true, half: true },
        { kind: 'tags', key: 'tagline', label: 'Tagline words', help: 'Shown in capitals under the hero title, separated by dots. Two to four short words work best.' },
        { kind: 'textarea', key: 'intro', label: 'Intro', help: 'One or two sentences. Appears in the hero and as the quote in About.', rows: 4, required: true },
        { kind: 'text', key: 'location', label: 'Location', half: true },
        { kind: 'text', key: 'email', label: 'Contact email', help: 'Shown on the site for people to contact you.', half: true },
        {
          kind: 'group',
          key: 'links',
          label: 'Links',
          fields: [
            { kind: 'url', key: 'linkedin', label: 'LinkedIn URL', half: true },
            { kind: 'url', key: 'github', label: 'GitHub URL', half: true },
          ],
        },
        { kind: 'text', key: 'githubHandle', label: 'GitHub handle text', help: 'Shown on the “More on GitHub” card.', placeholder: 'github.com/JitendraSethia', half: true },
        { kind: 'text', key: 'resumeFileName', label: 'Resume download name', help: 'The file name people get when they download your resume.', placeholder: 'Jitendra_Sethia_Resume.pdf', half: true },
        { kind: 'tags', key: 'interests', label: 'Interests', help: 'Chips at the bottom of About.' },
        {
          kind: 'list',
          key: 'education',
          label: 'Education',
          help: 'The first entry appears in About and the resume stats (CGPA).',
          title: (e) => e.school,
          subtitle: (e) => `${e.degree ?? ''} · ${e.period ?? ''}`,
          create: () => ({ school: '', place: '', degree: '', period: '', score: '' }),
          addLabel: 'Add education',
          item: [
            { kind: 'text', key: 'school', label: 'School / college', required: true, half: true },
            { kind: 'text', key: 'place', label: 'City', half: true },
            { kind: 'text', key: 'degree', label: 'Degree', half: true },
            { kind: 'text', key: 'period', label: 'Years', placeholder: '2023 – May 2027 (expected)', half: true },
            { kind: 'text', key: 'score', label: 'Score', placeholder: 'CGPA 7.76', half: true },
          ],
        },
        {
          kind: 'list',
          key: 'experience',
          label: 'Work experience',
          help: 'The first entry appears as “Now” in About.',
          title: (x) => (x.role ? `${x.role} — ${x.company ?? ''}` : x.company),
          subtitle: (x) => x.period,
          create: () => ({ company: '', role: '', place: '', period: '', points: [] }),
          addLabel: 'Add experience',
          item: [
            { kind: 'text', key: 'role', label: 'Role', required: true, half: true },
            { kind: 'text', key: 'company', label: 'Company', required: true, half: true },
            { kind: 'text', key: 'place', label: 'Place', half: true },
            { kind: 'text', key: 'period', label: 'Dates', placeholder: 'Jan 2026 – Present', half: true },
            { kind: 'lines', key: 'points', label: 'What you did', addLabel: 'Add point' },
          ],
        },
      ],
    },
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: '🎬',
    file: 'projects',
    intro: 'Your Originals. The order here is the order on the site — drag to rearrange.',
    root: {
      kind: 'list',
      key: '',
      label: '',
      title: (p) => p.title,
      subtitle: (p) => p.genre,
      preview: (p) => themeDot(p.theme),
      create: () => ({ id: '', title: '', year: '', genre: '', logline: '', stack: [], build: [], features: [], metrics: [], theme: 'crimson', motif: 'flow' }),
      addLabel: 'Add project',
      item: [
        { kind: 'text', key: 'title', label: 'Title', required: true, half: true },
        { kind: 'text', key: 'year', label: 'Corner badge', help: 'Short tag in the card corner — a year, “Client”, “Live”…', placeholder: '2026', half: true },
        { kind: 'text', key: 'genre', label: 'Genre line', placeholder: 'Automation • Make.com • AI media', half: true },
        { kind: 'textarea', key: 'logline', label: 'One-line pitch', rows: 2, required: true },
        { kind: 'tags', key: 'stack', label: 'Tech stack' },
        { kind: 'lines', key: 'build', label: 'What I built', help: 'The “My Contribution” bullets in the overlay.', addLabel: 'Add bullet' },
        { kind: 'tags', key: 'features', label: 'Key features' },
        metricsField,
        { kind: 'url', key: 'github', label: 'GitHub link', help: 'Leave empty to hide the GitHub button.', optional: true, half: true },
        { kind: 'url', key: 'live', label: 'Live demo link', help: 'Leave empty to hide the Live button.', optional: true, half: true },
        { kind: 'text', key: 'note', label: 'Note instead of links', help: 'For client work with no public demo, e.g. “Runs inside the client’s accounts · no public demo”.', optional: true },
        { kind: 'theme', key: 'theme', label: 'Colour theme' },
        { kind: 'select', key: 'motif', label: 'Poster artwork', options: MOTIFS.map((m) => ({ value: m, label: motifLabels[m] ?? m })), half: true },
      ],
    },
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: '🏆',
    file: 'achievements',
    intro: 'The award-poster cards in “Top Moments”. Drag to set the order.',
    root: {
      kind: 'list',
      key: '',
      label: '',
      title: (a) => a.title,
      subtitle: (a) => a.org,
      create: () => ({ id: '', title: '', org: '', detail: '', laurel: '' }),
      addLabel: 'Add achievement',
      item: [
        { kind: 'text', key: 'title', label: 'Title', placeholder: 'National Finalist', required: true, half: true },
        { kind: 'text', key: 'org', label: 'Event / organisation', placeholder: 'Smart India Hackathon 2025', required: true, half: true },
        { kind: 'text', key: 'laurel', label: 'Laurel text', help: 'The small gold words between the laurels.', placeholder: 'Top 0.1%', half: true },
        { kind: 'url', key: 'link', label: 'Link (optional)', help: 'Certificate, event page or repo. Leave empty to hide.', optional: true, half: true },
        { kind: 'textarea', key: 'detail', label: 'Description', rows: 3 },
      ],
    },
  },
  {
    id: 'repos',
    label: 'Public repos',
    icon: '⌨',
    file: 'repos',
    intro: 'The “Open source” row under Top Moments.',
    root: {
      kind: 'list',
      key: '',
      label: '',
      title: (r) => r.name,
      subtitle: (r) => r.issuer,
      create: () => ({ issuer: '', name: '', link: '' }),
      addLabel: 'Add repo',
      item: [
        { kind: 'text', key: 'name', label: 'Name', required: true, half: true },
        { kind: 'text', key: 'issuer', label: 'Tag', help: 'Language or framework shown in red.', placeholder: 'TypeScript', half: true },
        { kind: 'url', key: 'link', label: 'GitHub link', required: true },
      ],
    },
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: '🧩',
    file: 'skills',
    intro: 'Skill categories and their skills. Drag categories and skills to reorder.',
    root: {
      kind: 'list',
      key: '',
      label: '',
      title: (c) => c.title,
      subtitle: (c) => `${c.skills?.length ?? 0} skills · ${c.subtitle ?? ''}`,
      create: () => ({ id: '', title: '', subtitle: '', skills: [] }),
      addLabel: 'Add category',
      item: [
        { kind: 'text', key: 'title', label: 'Category', required: true, half: true },
        { kind: 'text', key: 'subtitle', label: 'Subtitle', half: true },
        {
          kind: 'list',
          key: 'skills',
          label: 'Skills',
          title: (s) => s.name,
          subtitle: (s) => (s.usedIn?.length ? `Used in: ${s.usedIn.join(', ')}` : ''),
          create: () => ({ name: '', mono: '', usedIn: [] }),
          addLabel: 'Add skill',
          item: [
            { kind: 'text', key: 'name', label: 'Skill', required: true, half: true },
            { kind: 'text', key: 'mono', label: 'Two-letter badge', help: 'Leave empty to use the first two letters.', placeholder: 'Py', half: true },
            { kind: 'text', key: 'note', label: 'Highlight label', help: 'Optional tag such as “Primary”.', optional: true, half: true },
            { kind: 'tags', key: 'usedIn', label: 'Where it’s used', help: 'Projects or achievements shown when the skill is hovered.', optional: true },
          ],
        },
      ],
    },
  },
  {
    id: 'journey',
    label: 'Journey',
    icon: '📺',
    file: 'seasons',
    intro: 'Your story as seasons and episodes. Episode codes (S02 E03) are numbered automatically.',
    root: {
      kind: 'list',
      key: '',
      label: '',
      title: (s, i) => `Season ${i + 1}: ${s.title ?? ''}`,
      subtitle: (s) => `${s.episodes?.length ?? 0} episodes · ${s.period ?? ''}`,
      create: () => ({ title: '', period: '', synopsis: '', episodes: [] }),
      addLabel: 'Add season',
      item: [
        { kind: 'text', key: 'title', label: 'Season title', required: true, half: true },
        { kind: 'text', key: 'period', label: 'Period', placeholder: '2025', half: true },
        { kind: 'textarea', key: 'synopsis', label: 'Synopsis', rows: 2 },
        {
          kind: 'list',
          key: 'episodes',
          label: 'Episodes',
          title: (e, i) => `E${String(i + 1).padStart(2, '0')} · ${e.title ?? ''}`,
          subtitle: (e) => e.runtime,
          preview: (e) => themeDot(e.theme),
          create: () => ({ title: '', description: '', tags: [], runtime: '', theme: 'violet' }),
          addLabel: 'Add episode',
          item: [
            { kind: 'text', key: 'title', label: 'Episode title', required: true, half: true },
            { kind: 'text', key: 'runtime', label: 'Runtime label', help: 'Small text on the card, e.g. a date or a number.', half: true },
            { kind: 'textarea', key: 'description', label: 'Description', rows: 2 },
            { kind: 'tags', key: 'tags', label: 'Tags' },
            { kind: 'theme', key: 'theme', label: 'Colour theme' },
          ],
        },
      ],
    },
  },
  {
    id: 'picks',
    label: 'Top Picks',
    icon: '🔟',
    file: 'topPicks',
    intro: 'The numbered “Top 10” row. Any number of cards works.',
    root: {
      kind: 'list',
      key: '',
      label: '',
      title: (p, i) => `#${i + 1} ${p.title ?? ''}`,
      subtitle: (p) => p.label,
      preview: (p) => themeDot(p.theme),
      create: () => ({ label: '', title: '', detail: '', theme: 'crimson' }),
      addLabel: 'Add pick',
      item: [
        { kind: 'text', key: 'label', label: 'Small label', placeholder: 'Biggest stage', half: true },
        { kind: 'text', key: 'title', label: 'Title', required: true, half: true },
        { kind: 'text', key: 'detail', label: 'Detail line' },
        { kind: 'theme', key: 'theme', label: 'Colour theme' },
      ],
    },
  },
  {
    id: 'intro',
    label: 'Play Intro',
    icon: '▶',
    file: 'introSlides',
    intro: 'The slides of the ▶ Play Intro highlight reel.',
    root: {
      kind: 'list',
      key: '',
      label: '',
      title: (s) => s.title,
      subtitle: (s) => s.kicker,
      create: () => ({ kicker: '', title: '', lines: [] }),
      addLabel: 'Add slide',
      minItems: 1,
      item: [
        { kind: 'text', key: 'kicker', label: 'Kicker', placeholder: 'Automation', half: true },
        { kind: 'text', key: 'title', label: 'Title', required: true, half: true },
        { kind: 'lines', key: 'lines', label: 'Lines', addLabel: 'Add line', rows: 1 },
        { kind: 'tags', key: 'chips', label: 'Chips (optional)', optional: true },
      ],
    },
  },
  {
    id: 'viewers',
    label: 'Who’s watching',
    icon: '🎭',
    file: 'viewers',
    intro: 'The profile picker after the opening. Each profile shows the same content in its own section order. The first profile is yours (it gets your photo and the MAIN badge).',
    root: {
      kind: 'list',
      key: '',
      label: '',
      title: (v) => v.name,
      subtitle: (v) => v.blurb,
      note: (i) => (i === 0 ? 'Main' : undefined),
      create: () => ({ id: '', name: '', blurb: '', color: '#4cc9ff', glyph: '', order: [...SECTION_IDS] }),
      addLabel: 'Add profile',
      minItems: 1,
      item: [
        { kind: 'text', key: 'name', label: 'Name', required: true, half: true },
        { kind: 'text', key: 'blurb', label: 'Short description', half: true },
        { kind: 'color', key: 'color', label: 'Avatar colour', half: true },
        { kind: 'text', key: 'glyph', label: 'Avatar symbol', help: 'One or two characters. Empty = first letter of the name.', optional: true, half: true },
        { kind: 'order', key: 'order', label: 'Section order for this profile', help: 'Drag to choose what this visitor sees first.', options: SECTION_IDS.map((id) => ({ value: id, label: SECTION_LABELS[id] })) },
      ],
    },
  },
  {
    id: 'sections',
    label: 'Section names',
    icon: '🏷',
    file: 'sections',
    intro: 'What each section is called in the top menu and on the “Continue Exploring” cards.',
    root: {
      kind: 'group',
      key: '',
      label: '',
      fields: SECTION_IDS.map(
        (id): Field => ({
          kind: 'group',
          key: id,
          label: SECTION_LABELS[id],
          fields: [
            { kind: 'text', key: 'nav', label: 'Menu name', required: true, half: true },
            { kind: 'text', key: 'card', label: 'Card title', required: true, half: true },
            { kind: 'theme', key: 'theme', label: 'Card colour' },
          ],
        }),
      ),
    },
  },
];

// ---------- publish-time helpers ----------

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'item';

/** Lists whose items need a stable unique id (used for keys and animations); ids are never shown in the editor. */
const ID_SOURCES: Partial<Record<FileName, string>> = { projects: 'title', achievements: 'title', skills: 'title', viewers: 'name' };

export function withIds(file: FileName, data: unknown): unknown {
  const from = ID_SOURCES[file];
  if (!from || !Array.isArray(data)) return data;
  const used = new Set<string>();
  return (data as Obj[]).map((item) => {
    let id = typeof item.id === 'string' && item.id && !used.has(item.id) ? item.id : slug(String(item[from] ?? ''));
    let n = 2;
    const base = id;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    return { ...item, id };
  });
}

/** Skills without a badge get the first two letters of their name. */
export function finalize(file: FileName, data: unknown): unknown {
  let out = withIds(file, data);
  if (file === 'skills' && Array.isArray(out)) {
    out = (out as Obj[]).map((c) => ({
      ...c,
      skills: (c.skills ?? []).map((s: Obj) => ({ ...s, mono: s.mono?.trim() || String(s.name ?? '').replace(/[^A-Za-z0-9]/g, '').slice(0, 2) || '•' })),
    }));
  }
  return out;
}

/** Finds required fields left empty, as readable messages. */
export function findProblems(field: Field, value: unknown, path: string): string[] {
  const out: string[] = [];
  if (field.kind === 'group') {
    for (const f of field.fields) out.push(...findProblems(f, (value as Obj)?.[f.key], [path, f.label].filter(Boolean).join(' › ')));
  } else if (field.kind === 'list') {
    ((value as Obj[]) ?? []).forEach((item, i) => {
      const name = field.title(item, i) || `item ${i + 1}`;
      for (const f of field.item) out.push(...findProblems(f, item?.[f.key], [path, name, f.label].filter(Boolean).join(' › ')));
    });
  } else if ('required' in field && field.required && !String(value ?? '').trim()) {
    out.push(`${path} is empty`);
  }
  return out;
}
