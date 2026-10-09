/**
 * Central portfolio data — built from Jitendra's CV (CV/Jitendra_Sethia_CV.md) and the
 * source-verified project inventory in PORTFOLIO-PLAN.md.
 * Every fact on the site comes from this file. Update it here and the whole site follows.
 * Numbers follow the plan's corrections: design targets are never presented as achieved results.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

export const profile = {
  fullName: 'Jitendra Sethia',
  displayName: 'Jitendra Sethia',
  firstName: 'JITENDRA',
  seriesTag: 'THE SERIES',
  /** Fictional studio card shown at the very start of the opening sequence. */
  originalLabel: 'A SETHIA ORIGINAL',
  role: 'AI Automation Engineer',
  tagline: ['AI Automation', 'Backend', 'AI Agents'],
  intro:
    'Automation engineer shipping production workflow systems for clients in Australia and India — a pipeline producing 300+ videos a month, a six-brand GoHighLevel build with an AI voice receptionist — backed by real engineering in FastAPI, Node.js and PostgreSQL.',
  location: 'Kolkata, India',
  email: 'jitendrasethia053@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/jitendra-sethia',
    github: 'https://github.com/JitendraSethia',
  },
  githubHandle: 'github.com/JitendraSethia',
  resumePdf: '/assets/Jitendra_Sethia_Resume.pdf',
  resumeFileName: 'Jitendra_Sethia_Resume.pdf',
  portrait: {
    src: '/assets/portrait-720.webp',
    srcSet: '/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w',
    alt: 'Portrait of Jitendra Sethia',
  },
  interests: ['Agentic AI', 'Reliability engineering', 'Voice agents', 'Rhythm instruments'],
};

export const education = [
  {
    school: 'Techno International Newtown',
    place: 'Kolkata',
    degree: 'B.Tech — Computer Science & Engineering (MAKAUT)',
    period: '2023 – May 2027 (expected)',
    score: 'CGPA 7.76',
  },
  {
    school: 'Pearls Of God',
    place: 'Kolkata',
    degree: 'Higher Secondary (XII)',
    period: '2023',
    score: 'Class XII',
  },
];

export const experience = [
  {
    company: 'Codexlane Infotech Pvt. Ltd.',
    role: 'AI Automation Engineer',
    place: 'Kolkata',
    period: 'Current',
    points: [
      'Design multi-router Make.com and n8n scenarios orchestrating GoHighLevel CRM with OpenAI, ElevenLabs, Creatomate, Meta Graph API, YouTube Data API, Twilio and VAPI.',
      'Configure GoHighLevel sub-accounts, pipelines, funnels and automation workflows end to end for client delivery.',
      'Primary technical contact on client accounts — requirement gathering, build, and full rebuild documentation as a standard deliverable.',
    ],
  },
  {
    company: 'Freelance',
    role: 'Automation Engineer',
    place: 'Clients in Australia and India',
    period: 'Ongoing',
    points: [
      'Six-brand GoHighLevel implementation for an Australian tree-care group — Twilio SMS, call forwarding, an AI receptionist and a VAPI lead-qualification agent.',
      'Content pipeline producing 300+ videos per month with throttling, webhook deduplication and exponential-backoff retries.',
      '"Mark", a VAPI voice booking agent with two-way GoHighLevel ↔ Google Calendar sync; fixed tool-call failures, timezone mismatches and sync drift that caused double-bookings.',
      'Finance and operations automation for an agricultural client on Make.com and Airtable; custom Node.js backend for Jain Consultancy where no-code hit its limits.',
    ],
  },
];

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
  motif: 'shield' | 'flow' | 'tenants' | 'chat' | 'agent' | 'chart';
};

const GH = 'https://github.com/JitendraSethia';

export const projects: Project[] = [
  {
    id: 'content-engine',
    title: 'The Content Engine',
    year: 'Client',
    genre: 'Automation • Make.com • AI media',
    logline: 'A topic goes in. A scripted, voiced, rendered and published video comes out — 300+ times a month.',
    stack: ['Make.com', 'OpenAI', 'ElevenLabs', 'Creatomate', 'Meta Graph API', 'YouTube Data API'],
    build: [
      'Architected a Make.com scenario chaining OpenAI (scripting) → ElevenLabs (voice) → Creatomate (render) → Meta and YouTube APIs (publish) for an MSME brand.',
      'Token-bucket throttling on rate-limited endpoints so the pipeline never trips provider limits.',
      'Webhook deduplication, so a replayed hook can never double-post a video.',
      'Exponential-backoff retries on render failures, so a flaky render recovers on its own instead of stalling the queue.',
    ],
    features: ['Script generation', 'AI voice-over', 'Templated video render', 'Auto-publish to Meta + YouTube', 'Dedup + retry built in'],
    metrics: [
      { value: '300+', label: 'videos per month' },
      { value: '4', label: 'AI / media services chained' },
      { value: '2', label: 'publishing platforms' },
    ],
    note: 'Runs inside the client’s accounts · no public demo',
    palette: { from: '#1a0d02', via: '#8a4a07', to: '#0a0806', accent: '#ffb547' },
    motif: 'flow',
  },
  {
    id: 'never-miss-a-lead',
    title: 'Never Miss a Lead',
    year: 'Client',
    genre: 'GoHighLevel • Voice AI • Twilio',
    logline: 'A six-brand tree-care group in Australia — every after-hours call is now answered, qualified and routed instead of lost.',
    stack: ['GoHighLevel', 'VAPI', 'Twilio', 'Google Calendar'],
    build: [
      'Configured 6 GoHighLevel sub-accounts with Twilio SMS workflows, call forwarding and an AI receptionist.',
      'Built a VAPI lead-qualification voice agent so calls outside business hours are answered and routed.',
      'Built "Mark", a VAPI voice booking agent with two-way GoHighLevel ↔ Google Calendar sync — diagnosed and fixed tool-call failures, timezone mismatches and availability-sync drift that was producing double-bookings.',
    ],
    features: ['AI receptionist', 'Voice lead qualification', 'SMS follow-up', 'Two-way calendar sync', 'Per-brand sub-accounts'],
    metrics: [
      { value: '6', label: 'brands / sub-accounts' },
      { value: '24/7', label: 'calls answered' },
      { value: '2-way', label: 'calendar sync' },
    ],
    note: 'Runs inside the client’s accounts · no public demo',
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'chat',
  },
  {
    id: 'telemedicine-backend',
    title: 'Telemedicine Backend',
    year: 'Backend',
    genre: 'Backend • Reliability • Security',
    logline: 'A booking backend built around the failure path — idempotent requests, a compensating saga and encrypted patient data.',
    stack: ['Fastify', 'TypeScript', 'PostgreSQL', 'Redis', 'BullMQ', 'Docker'],
    build: [
      'Postgres-durable idempotency layer with request fingerprinting and exact response replay.',
      '3-step booking saga with compensating transactions, guarded by row locks and a delayed recovery job — four independent double-booking guards.',
      'AES-256-GCM field encryption with a rotatable key ring and an HMAC blind index; tamper-evident audit log.',
      'OpenTelemetry + Prometheus instrumentation and GitHub Actions CI with real service containers. Designed against latency and uptime targets from the brief (not load-tested); payments and notifications are mocked at the interface boundary.',
    ],
    features: ['Idempotency layer', 'Booking saga with compensation', 'Field-level encryption', 'Audit log', 'OTel + Prometheus', 'CI with live services'],
    metrics: [
      { value: '36', label: 'REST endpoints' },
      { value: '10', label: 'migrations' },
      { value: '33', label: 'passing tests' },
      { value: '4', label: 'double-booking guards' },
    ],
    github: `${GH}/amrutam-telemedicine-backend`,
    palette: { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' },
    motif: 'shield',
  },
  {
    id: 'prep-portal',
    title: 'Prep Portal',
    year: 'Client',
    genre: 'Full-Stack • EdTech • AI',
    logline: 'A NEET / JEE / CUET exam platform with a tamper-proof timer and AI explanations that never leave a student stranded.',
    stack: ['Next.js 16', 'React 19', 'Prisma', 'PostgreSQL', 'NextAuth', 'Gemini'],
    build: [
      'Server-derived exam timer that survives reloads and client tampering, with idempotent submission.',
      'Exam player with a 5-state question palette, 30-second autosave and per-question time tracking.',
      'Polymorphic scoring engine with negative marking; streamed Gemini explanations cached in the DB, falling back to author solutions when the API is unavailable.',
      'Admin analytics with per-student drilldown. Built for a real freelance brief — all four core asks implemented.',
    ],
    features: ['Reload-proof timer', 'Autosave', 'Negative marking', 'Streamed AI explanations', 'Admin analytics'],
    metrics: [
      { value: '17', label: 'model schema' },
      { value: '30s', label: 'autosave' },
      { value: '~7.1k', label: 'lines of code' },
    ],
    github: `${GH}/prep-portal`,
    palette: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
    motif: 'tenants',
  },
  {
    id: 'ai-first-crm',
    title: 'AI-First CRM',
    year: 'AI',
    genre: 'AI Agents • LangGraph • Full-Stack',
    logline: 'Log a doctor visit by chatting or by form — both go through the same code path, so they can never disagree.',
    stack: ['FastAPI', 'LangGraph', 'Groq', 'React', 'Redux Toolkit', 'SQLAlchemy'],
    build: [
      'A LangGraph ReAct agent with exactly 5 tools that share the same CRUD layer as the REST endpoints, so agent-driven and form-driven writes cannot diverge.',
      'Two-tier model routing on Groq — Llama 3.3 70B for reasoning, Llama 3.1 8B for extraction — to cut cost and latency.',
      'Configured automatic retry plus custom 429 detection and graceful degradation; works without an API key.',
      'Agent tool calls surface in the UI as labelled pills, and the form visibly fills in when the agent logs something.',
    ],
    features: ['ReAct agent, 5 tools', 'Shared CRUD layer', 'Two-tier model routing', 'Rate-limit resilience', 'Live form fill'],
    metrics: [
      { value: '5', label: 'agent tools' },
      { value: '2', label: 'model tiers' },
      { value: '1', label: 'shared write path' },
    ],
    github: `${GH}/Task1--Jitenda-Sethia`,
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'agent',
  },
  {
    id: 'peoples-priorities',
    title: "People's Priorities",
    year: 'GDG',
    genre: 'Civic Tech • AI • Maps',
    logline: 'Kolkata citizens report problems in Bengali, Hindi or English; officials see them triaged, clustered and mapped.',
    stack: ['Flask', 'Google Gemini', 'Google Maps', 'Capacitor'],
    build: [
      'Gemini 2.5 Flash structured-output classification behind a complete rule-based fallback — the platform runs with zero API keys and a submission never stalls on an outage.',
      'Explainable 0–100 urgency scoring with human-readable justifications.',
      'Duplicate clustering combining geo-proximity and text similarity; officials console with a heatmap and ward planning.',
      'A grounded status assistant for citizens, plus two Android wrappers (citizen and authority).',
    ],
    features: ['Trilingual intake', 'AI + rule-based fallback', 'Urgency scoring', 'Duplicate clustering', 'Heatmap console'],
    metrics: [
      { value: '3', label: 'languages' },
      { value: '22', label: 'routes' },
      { value: '0', label: 'API keys required' },
    ],
    github: `${GH}/GDG--People-s-Priorities--Kolkata`,
    palette: { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' },
    motif: 'flow',
  },
  {
    id: 'realtime-chat',
    title: 'Realtime Chat',
    year: 'Live',
    genre: 'Realtime • Web + Android',
    logline: 'Web and Android chat where “online” stays true even with five tabs open — and it’s live right now.',
    stack: ['Node.js', 'Socket.IO', 'React', 'React Native (Expo)', 'MongoDB / SQLite'],
    build: [
      'Reference-counted presence that stays correct across multiple tabs and devices.',
      'Typing indicators and acknowledgement-based delivery receipts.',
      'Pluggable SQLite / MongoDB storage behind a 2-method repository interface.',
      'Backend and web client deployed on Render, plus an Expo React Native Android app.',
    ],
    features: ['Multi-tab presence', 'Typing indicators', 'Delivery receipts', 'Pluggable storage', 'Android app'],
    metrics: [
      { value: '2', label: 'clients (web + Android)' },
      { value: 'Live', label: 'on Render' },
      { value: '2', label: 'storage backends' },
    ],
    github: `${GH}/ChatBot`,
    live: 'https://realtime-chat-web-fgrx.onrender.com',
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'chat',
  },
  {
    id: 'futures-bot',
    title: 'Futures Trading Bot',
    year: 'Python',
    genre: 'Python • Trading • CLI + UI',
    logline: 'Binance Futures testnet orders through one core, three interfaces — including the bug it found in its own clock.',
    stack: ['Python', 'python-binance', 'Streamlit'],
    build: [
      'MARKET, LIMIT and STOP orders over one validation → order → client core, reused with zero duplication.',
      'Three interfaces on the same core: a flag CLI, a guided interactive mode and a Streamlit UI.',
      'Hardcoded to testnet two independent ways.',
      'Diagnosed a Binance -1021 clock-drift error from the order logs and fixed it with server-time sync.',
    ],
    features: ['3 order types', 'CLI + interactive + UI', 'Testnet-locked', 'Clock-drift fix'],
    metrics: [
      { value: '3', label: 'order types' },
      { value: '3', label: 'interfaces, one core' },
      { value: '2×', label: 'testnet safeguards' },
    ],
    github: `${GH}/trading_bot`,
    palette: { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' },
    motif: 'chart',
  },
];

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
};

export const achievements: Achievement[] = [
  {
    id: 'sih-2025',
    title: 'National Finalist',
    org: 'Smart India Hackathon 2025',
    detail: 'Team lead, Suryadut — a solar-powered de-watering system for mining operations. Top 0.1% of 50,000+ teams nationally.',
    laurel: 'Top 0.1%',
  },
  {
    id: 'ai-for-bharat',
    title: 'GramLink AI',
    org: 'AI For Bharat 2025',
    detail: 'Lead developer — a multilingual government-scheme eligibility assistant.',
    laurel: 'Lead Developer',
  },
  {
    id: 'eibs',
    title: 'Bond Buy',
    org: 'EIBS 2025',
    detail: 'Lead developer — blockchain bond tokenization with SIP infrastructure on WeilChain.',
    laurel: 'Lead Developer',
  },
  {
    id: 'gdg',
    title: "People's Priorities",
    org: 'GDG Build with AI · Kolkata',
    detail: 'Trilingual civic-grievance triage platform with AI classification and a full rule-based fallback.',
    laurel: 'Build with AI',
    link: `${GH}/GDG--People-s-Priorities--Kolkata`,
  },
];

/** Public, verifiable code — shown as a rail under the achievements. */
export type Credential = { issuer: string; name: string; link: string };

export const repos: Credential[] = [
  { issuer: 'TypeScript', name: 'Telemedicine Backend', link: `${GH}/amrutam-telemedicine-backend` },
  { issuer: 'Next.js', name: 'Prep Portal', link: `${GH}/prep-portal` },
  { issuer: 'Python', name: 'AI-First CRM (LangGraph)', link: `${GH}/Task1--Jitenda-Sethia` },
  { issuer: 'Flask', name: "People's Priorities — Kolkata", link: `${GH}/GDG--People-s-Priorities--Kolkata` },
  { issuer: 'Node.js', name: 'Realtime Chat (web + Android)', link: `${GH}/ChatBot` },
  { issuer: 'Python', name: 'Futures Trading Bot', link: `${GH}/trading_bot` },
];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'automation',
    title: 'Automation',
    subtitle: 'The day job',
    skills: [
      { name: 'Make.com', mono: 'Mk', note: 'Primary' },
      { name: 'n8n', mono: 'n8' },
      { name: 'GoHighLevel', mono: 'GH' },
      { name: 'Airtable', mono: 'At' },
      { name: 'Webhooks', mono: 'Wh' },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Voice',
    subtitle: 'Agents that take actions',
    skills: [
      { name: 'VAPI', mono: 'Va' },
      { name: 'OpenAI', mono: 'Oa' },
      { name: 'ElevenLabs', mono: 'El' },
      { name: 'Gemini', mono: 'Ge' },
      { name: 'Groq', mono: 'Gq' },
      { name: 'LangGraph', mono: 'Lg' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    subtitle: 'Wiring the world together',
    skills: [
      { name: 'Twilio', mono: 'Tw' },
      { name: 'Google Workspace', mono: 'Gw' },
      { name: 'Meta Graph API', mono: 'Me' },
      { name: 'YouTube Data API', mono: 'Yt' },
      { name: 'Creatomate', mono: 'Cr' },
      { name: 'OAuth 2.0', mono: 'Oa' },
    ],
  },
  {
    id: 'reliability',
    title: 'Reliability',
    subtitle: 'Built to run unattended',
    skills: [
      { name: 'Webhook dedup', mono: 'Dd' },
      { name: 'Retry + backoff', mono: 'Rb' },
      { name: 'Rate limiting', mono: 'Rl' },
      { name: 'Idempotency', mono: 'Id' },
      { name: 'Saga compensation', mono: 'Sg' },
      { name: 'Graceful degradation', mono: 'Gd' },
    ],
  },
  {
    id: 'languages',
    title: 'Languages',
    subtitle: 'Python & TypeScript first',
    skills: [
      { name: 'Python', mono: 'Py' },
      { name: 'TypeScript', mono: 'Ts' },
      { name: 'JavaScript', mono: 'Js' },
      { name: 'SQL', mono: 'Sq' },
      { name: 'Java', mono: 'Jv' },
      { name: 'C', mono: 'C' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Data',
    subtitle: 'When no-code hits its limits',
    skills: [
      { name: 'FastAPI', mono: 'Fa' },
      { name: 'Node.js', mono: 'No' },
      { name: 'Fastify', mono: 'Fy' },
      { name: 'Flask', mono: 'Fl' },
      { name: 'PostgreSQL', mono: 'Pg' },
      { name: 'Redis', mono: 'Rd' },
      { name: 'Prisma', mono: 'Pr' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend & Infra',
    subtitle: 'Shipping it',
    skills: [
      { name: 'React', mono: 'Re' },
      { name: 'Next.js', mono: 'Nx' },
      { name: 'React Native', mono: 'Rn' },
      { name: 'Docker', mono: 'Dk' },
      { name: 'GitHub Actions', mono: 'Ga' },
      { name: 'OpenTelemetry', mono: 'Ot' },
    ],
  },
];

/**
 * Factual cross-references shown when a skill card is hovered/tapped:
 * where the skill appears in the projects and achievements.
 */
export const skillEvidence: Record<string, string[]> = {
  'Make.com': ['The Content Engine', 'Farm finance & ops automation'],
  n8n: ['Codexlane client builds'],
  GoHighLevel: ['Never Miss a Lead', 'Codexlane client builds'],
  Airtable: ['Farm finance & ops automation'],
  Webhooks: ['The Content Engine'],
  VAPI: ['Never Miss a Lead', '"Mark" booking agent'],
  OpenAI: ['The Content Engine'],
  ElevenLabs: ['The Content Engine'],
  Gemini: ["People's Priorities", 'Prep Portal'],
  Groq: ['AI-First CRM'],
  LangGraph: ['AI-First CRM'],
  Twilio: ['Never Miss a Lead'],
  'Google Workspace': ['"Mark" calendar sync', 'Farm finance & ops automation'],
  'Meta Graph API': ['The Content Engine'],
  'YouTube Data API': ['The Content Engine'],
  Creatomate: ['The Content Engine'],
  'Webhook dedup': ['The Content Engine'],
  'Retry + backoff': ['The Content Engine', 'AI-First CRM'],
  'Rate limiting': ['The Content Engine', 'AI-First CRM'],
  Idempotency: ['Telemedicine Backend', 'Prep Portal'],
  'Saga compensation': ['Telemedicine Backend'],
  'Graceful degradation': ["People's Priorities", 'AI-First CRM', 'Prep Portal'],
  Python: ['AI-First CRM', "People's Priorities", 'Futures Trading Bot'],
  TypeScript: ['Telemedicine Backend', 'Prep Portal'],
  FastAPI: ['AI-First CRM'],
  'Node.js': ['Realtime Chat', 'Jain Consultancy platform'],
  Fastify: ['Telemedicine Backend'],
  Flask: ["People's Priorities"],
  PostgreSQL: ['Telemedicine Backend', 'Prep Portal'],
  Redis: ['Telemedicine Backend'],
  Prisma: ['Prep Portal'],
  React: ['AI-First CRM', 'Realtime Chat'],
  'Next.js': ['Prep Portal'],
  'React Native': ['Realtime Chat'],
  Docker: ['Telemedicine Backend'],
  'GitHub Actions': ['Telemedicine Backend'],
  OpenTelemetry: ['Telemedicine Backend'],
};

export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Season = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
};

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const seasons: Season[] = [
  {
    number: 1,
    title: 'The Beginning',
    period: '2023',
    synopsis: 'Kolkata. School wraps up, and Computer Science begins.',
    episodes: [
      {
        code: 'S01 E01',
        title: 'The Foundation',
        description: 'Higher Secondary (XII) at Pearls Of God, Kolkata.',
        tags: ['Class XII'],
        runtime: '2023',
        palette: amber,
      },
      {
        code: 'S01 E02',
        title: 'The Engineer',
        description: 'B.Tech in Computer Science & Engineering at Techno International Newtown (MAKAUT) — DSA, ML, networks, DBMS, image processing.',
        tags: ['B.Tech CSE', 'CGPA 7.76'],
        runtime: '2023 – 2027',
        palette: violet,
      },
    ],
  },
  {
    number: 2,
    title: 'Into the Wild',
    period: 'Freelance',
    synopsis: 'Real clients, real phones ringing at 2 AM. Automation that has to work when nobody is watching.',
    episodes: [
      {
        code: 'S02 E01',
        title: 'Never Miss a Lead',
        description: 'Six GoHighLevel sub-accounts for an Australian tree-care group, with an AI receptionist and a VAPI qualification agent.',
        tags: ['GoHighLevel', 'VAPI', 'Twilio'],
        runtime: 'Australia',
        palette: jade,
      },
      {
        code: 'S02 E02',
        title: 'The Content Engine',
        description: '300+ videos a month from one Make.com scenario — script, voice, render, publish — with dedup and retries.',
        tags: ['Make.com', 'OpenAI', 'ElevenLabs'],
        runtime: '300+ / month',
        palette: amber,
      },
      {
        code: 'S02 E03',
        title: 'Meet Mark',
        description: 'A VAPI voice booking agent with two-way calendar sync — and the hunt for the drift that caused double-bookings.',
        tags: ['VAPI', 'Google Calendar'],
        runtime: 'Voice agent',
        palette: crimson,
      },
      {
        code: 'S02 E04',
        title: 'The Back Office',
        description: 'Invoice parsing, reconciliation, scheduling and restock alerts for an agricultural client; a custom Node.js platform for Jain Consultancy.',
        tags: ['Airtable', 'Make.com', 'Node.js'],
        runtime: 'Ops automation',
        palette: ocean,
      },
    ],
  },
  {
    number: 3,
    title: 'Under the Hood',
    period: 'Engineering',
    synopsis: 'Going past what visual builders expose — backends, agents and realtime systems, written from scratch.',
    episodes: [
      {
        code: 'S03 E01',
        title: 'The Saga',
        description: 'A telemedicine backend with an idempotency layer, a compensating booking saga and AES-256-GCM field encryption.',
        tags: ['Fastify', 'PostgreSQL', 'BullMQ'],
        runtime: '36 endpoints',
        palette: crimson,
      },
      {
        code: 'S03 E02',
        title: 'The Agent',
        description: 'An AI-first CRM where a LangGraph agent and a form share one write path.',
        tags: ['LangGraph', 'FastAPI', 'Groq'],
        runtime: '5 tools',
        palette: ocean,
      },
      {
        code: 'S03 E03',
        title: 'Presence',
        description: 'Realtime chat on web and Android with reference-counted presence — deployed and live.',
        tags: ['Socket.IO', 'Expo'],
        runtime: 'Live on Render',
        palette: jade,
      },
      {
        code: 'S03 E04',
        title: 'Clock Drift',
        description: 'A Binance Futures testnet bot — and the -1021 error that taught it to sync with the server clock.',
        tags: ['Python', 'Streamlit'],
        runtime: '3 interfaces',
        palette: violet,
      },
    ],
  },
  {
    number: 4,
    title: 'The National Stage',
    period: '2025',
    synopsis: 'Four competitions, one national final.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'Suryadut',
        description: 'Smart India Hackathon 2025 National Finalist — team lead, top 0.1% of 50,000+ teams.',
        tags: ['SIH 2025', 'Hardware', 'Team lead'],
        runtime: 'National final',
        palette: amber,
      },
      {
        code: 'S04 E02',
        title: "People's Priorities",
        description: 'GDG Build with AI, Kolkata — trilingual civic-grievance triage that works with zero API keys.',
        tags: ['Gemini', 'Flask', 'Maps'],
        runtime: 'GDG',
        palette: jade,
      },
      {
        code: 'S04 E03',
        title: 'GramLink & Bond Buy',
        description: 'AI For Bharat (multilingual scheme eligibility) and EIBS (bond tokenization with SIP on WeilChain) — lead developer on both.',
        tags: ['AI For Bharat', 'EIBS'],
        runtime: '2 builds',
        palette: violet,
      },
    ],
  },
  {
    number: 5,
    title: 'Now Streaming',
    period: 'Present',
    synopsis: 'Automation by day, engineering by night — and the degree finishes in 2027.',
    episodes: [
      {
        code: 'S05 E01',
        title: 'The Automation Engineer',
        description: 'AI Automation Engineer at Codexlane Infotech — Make.com, n8n and GoHighLevel builds with full rebuild documentation.',
        tags: ['Codexlane', 'n8n', 'GoHighLevel'],
        runtime: 'Current',
        palette: crimson,
      },
      {
        code: 'S05 E02',
        title: 'Prep Portal',
        description: 'A NEET / JEE / CUET exam platform for a freelance client — reload-proof timer, autosave and streamed AI explanations.',
        tags: ['Next.js', 'Prisma', 'Gemini'],
        runtime: 'Client build',
        palette: violet,
      },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };

export const topPicks: TopPick[] = [
  { label: 'Biggest stage', title: 'SIH 2025', detail: 'National Finalist • top 0.1% of 50,000+ teams', palette: amber },
  { label: 'Highest volume', title: '300+ videos', detail: 'per month, from one pipeline', palette: crimson },
  { label: 'Most brands', title: '6 sub-accounts', detail: 'GoHighLevel + VAPI for one tree-care group', palette: jade },
  { label: 'Deepest engineering', title: 'The Saga', detail: 'Idempotency • compensation • encryption', palette: ocean },
  { label: 'Live right now', title: 'Realtime Chat', detail: 'Web on Render + Android app', palette: violet },
  { label: 'Smartest agent', title: '5 tools, 1 path', detail: 'LangGraph CRM with a shared CRUD layer', palette: amber },
  { label: 'Most resilient', title: '0 API keys', detail: "People's Priorities runs on its fallback", palette: jade },
  { label: 'Best bug story', title: 'Error -1021', detail: 'Clock drift, found in the logs, fixed', palette: crimson },
  { label: 'Public code', title: `${repos.length} repos`, detail: 'All open on GitHub', palette: ocean },
  { label: 'Current role', title: 'Codexlane', detail: 'AI Automation Engineer', palette: violet },
];

/** Slides for the "▶ Play Intro" cinematic sequence. */
export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'The pitch',
    title: 'Built to run unattended.',
    lines: ['Automation that keeps working when nobody is watching', 'Dedup · retries · fallbacks · idempotency'],
  },
  {
    kicker: 'Automation',
    title: '300+ videos a month',
    lines: ['Script → voice → render → publish, in one Make.com scenario', 'Six-brand GoHighLevel build with an AI receptionist'],
    chips: ['Make.com', 'n8n', 'GoHighLevel', 'VAPI', 'Twilio'],
  },
  {
    kicker: 'Engineering',
    title: 'Under the hood',
    lines: ['Telemedicine backend — saga, idempotency, encryption', 'AI-first CRM — LangGraph agent, shared write path', 'Realtime chat — live on web and Android'],
    chips: ['FastAPI', 'Node.js', 'Next.js', 'PostgreSQL'],
  },
  {
    kicker: 'Achievement',
    title: 'National Finalist',
    lines: ['Smart India Hackathon 2025', 'Team lead · top 0.1% of 50,000+ teams'],
  },
  {
    kicker: 'Now',
    title: 'AI Automation Engineer',
    lines: ['Codexlane Infotech · freelance clients in Australia and India', 'B.Tech CSE, Techno International Newtown — 2027'],
  },
  {
    kicker: 'Next episode',
    title: "Let's build yours",
    lines: [profile.email],
  },
];

export type ProfileId = 'jitendra' | 'client' | 'recruiter' | 'developer';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';

/** The owner's profile — shown with the portrait and the MAIN badge. */
export const MAIN_PROFILE: ProfileId = 'jitendra';

export const viewerProfiles: {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  glyph?: string;
  order: SectionId[];
}[] = [
  {
    id: 'jitendra',
    name: 'Jitendra',
    blurb: 'The full series, in order',
    color: '#e5132b',
    order: ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'],
  },
  {
    id: 'client',
    name: 'Client',
    blurb: 'What I can automate for you',
    color: '#ffb547',
    glyph: '⚡',
    order: ['originals', 'picks', 'skills', 'about', 'moments', 'journey', 'story'],
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    blurb: 'Resume, achievements & skills first',
    color: '#4cc9ff',
    glyph: 'R',
    order: ['story', 'moments', 'skills', 'originals', 'about', 'journey', 'picks'],
  },
  {
    id: 'developer',
    name: 'Developer',
    blurb: 'Projects, stack & GitHub first',
    color: '#46e3a8',
    glyph: '</>',
    order: ['originals', 'skills', 'journey', 'moments', 'about', 'picks', 'story'],
  },
];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'About', card: 'About Me', meta: 'The Pilot • Who I am', palette: violet },
  journey: { nav: 'Journey', card: 'My Journey', meta: `${seasons.length} Seasons • ${seasons.reduce((n, s) => n + s.episodes.length, 0)} Episodes`, palette: amber },
  originals: { nav: 'Originals', card: 'My Projects', meta: `${projects.length} Originals`, palette: crimson },
  picks: { nav: 'Top Picks', card: 'Top Picks', meta: 'Top 10 highlights', palette: jade },
  skills: { nav: 'Skills', card: 'My Skills', meta: `${skillCategories.length} Categories`, palette: ocean },
  moments: { nav: 'Moments', card: 'My Achievements', meta: `${achievements.length} Moments • ${repos.length} public repos`, palette: crimson },
  story: { nav: 'Resume', card: 'The Full Story', meta: 'Resume • View & download', palette: violet },
};
