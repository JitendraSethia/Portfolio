// GET  /api/content  → the latest content JSON straight from the repo (logged in only)
// POST /api/content  { files: { name: data }, assets: [{ path, base64 }], baseSha } → one commit → Vercel redeploys
import { assertSameOrigin, errorResponse, HttpError, json, readCookie, validSession } from './_lib/auth.js';
import { commitFiles, headSha, readText, type FileChange } from './_lib/github.js';

/** The editable content files and whether each holds a list or a single object. */
const CONTENT: Record<string, 'array' | 'object'> = {
  profile: 'object',
  projects: 'array',
  achievements: 'array',
  repos: 'array',
  skills: 'array',
  seasons: 'array',
  topPicks: 'array',
  introSlides: 'array',
  viewers: 'array',
  sections: 'object',
};
const contentPath = (name: string) => `src/content/${name}.json`;

/** Uploads may only replace these files. */
const ASSET_PATH = /^public\/assets\/(portrait-(420|720|1100)\.webp|og-image\.jpg|[A-Za-z0-9_.-]+\.pdf)$/;
const MAX_JSON = 512 * 1024;
const MAX_ASSET = 3 * 1024 * 1024; // Vercel caps a request body at 4.5 MB, and base64 adds a third

async function requireAuth(req: Request) {
  if (!(await validSession(readCookie(req)))) throw new HttpError(401, 'Please log in again.');
}

export async function GET(req: Request): Promise<Response> {
  try {
    assertSameOrigin(req);
    await requireAuth(req);
    const sha = await headSha();
    const names = Object.keys(CONTENT);
    const texts = await Promise.all(names.map((n) => readText(contentPath(n), sha)));
    const files = Object.fromEntries(names.map((n, i) => [n, JSON.parse(texts[i])]));
    return json({ sha, files });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    assertSameOrigin(req);
    await requireAuth(req);
    const body = (await req.json()) as {
      files?: Record<string, unknown>;
      assets?: { path: string; base64: string }[];
      baseSha?: string;
    };

    const changes: FileChange[] = [];
    for (const [name, data] of Object.entries(body.files ?? {})) {
      const kind = CONTENT[name];
      if (!kind) throw new HttpError(400, `Unknown content file: ${name}`);
      const ok = kind === 'array' ? Array.isArray(data) : data !== null && typeof data === 'object' && !Array.isArray(data);
      if (!ok) throw new HttpError(400, `${name} has the wrong shape.`);
      const text = JSON.stringify(data, null, 2) + '\n';
      if (text.length > MAX_JSON) throw new HttpError(413, `${name} is too large.`);
      changes.push({ path: contentPath(name), content: text, encoding: 'utf-8' });
    }
    for (const a of body.assets ?? []) {
      if (!ASSET_PATH.test(a.path)) throw new HttpError(400, `Not an allowed upload: ${a.path}`);
      if (a.base64.length * 0.75 > MAX_ASSET) throw new HttpError(413, `${a.path} is too large (max 3 MB).`);
      changes.push({ path: a.path, content: a.base64, encoding: 'base64' });
    }
    if (!changes.length) throw new HttpError(400, 'Nothing to publish.');

    const what = [...Object.keys(body.files ?? {}), ...(body.assets?.length ? ['files'] : [])].join(', ');
    const sha = await commitFiles(changes, `Update ${what} via admin`, body.baseSha);
    return json({ ok: true, sha });
  } catch (e) {
    return errorResponse(e);
  }
}
