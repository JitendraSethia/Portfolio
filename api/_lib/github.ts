// Reads and writes the portfolio repo through the GitHub API (token in GITHUB_TOKEN).
// Every publish is one commit, so the site history doubles as an undo log.
import { HttpError } from './auth.js';

const REPO = process.env.GITHUB_REPO ?? 'JitendraSethia/Portfolio';
const BRANCH = process.env.GITHUB_BRANCH ?? 'main';

async function gh<T>(path: string, init: RequestInit = {}, accept = 'application/vnd.github+json'): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new HttpError(500, 'Saving is not configured (GITHUB_TOKEN missing).');
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: accept,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'portfolio-admin',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error(`GitHub ${init.method ?? 'GET'} ${path} → ${res.status}: ${detail.slice(0, 300)}`);
    throw new HttpError(502, `GitHub request failed (${res.status}).`);
  }
  return (accept.includes('raw') ? ((await res.text()) as T) : ((await res.json()) as T));
}

export async function headSha(): Promise<string> {
  const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${BRANCH}`);
  return ref.object.sha;
}

export async function readText(path: string, ref: string): Promise<string> {
  return gh<string>(`/contents/${path}?ref=${ref}`, {}, 'application/vnd.github.raw+json');
}

export type FileChange = { path: string; content: string; encoding: 'utf-8' | 'base64' };

/** Commits all changes on top of `expectedHead`; refuses if the branch moved since the editor loaded it. */
export async function commitFiles(changes: FileChange[], message: string, expectedHead?: string): Promise<string> {
  const head = await headSha();
  if (expectedHead && expectedHead !== head) {
    throw new HttpError(409, 'The site changed since you opened the editor. Reload to get the latest version, then make your edit again.');
  }
  const commit = await gh<{ tree: { sha: string } }>(`/git/commits/${head}`);
  const blobs = await Promise.all(
    changes.map((c) =>
      gh<{ sha: string }>('/git/blobs', { method: 'POST', body: JSON.stringify({ content: c.content, encoding: c.encoding }) }).then((b) => ({
        path: c.path,
        mode: '100644',
        type: 'blob',
        sha: b.sha,
      })),
    ),
  );
  const tree = await gh<{ sha: string }>('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: commit.tree.sha, tree: blobs }) });
  const next = await gh<{ sha: string }>('/git/commits', { method: 'POST', body: JSON.stringify({ message, tree: tree.sha, parents: [head] }) });
  await gh(`/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: next.sha }) });
  return next.sha;
}
