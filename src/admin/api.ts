/** Thin client for /api/auth and /api/content. The session cookie is HttpOnly, so the browser sends it for us. */

export class ApiError extends Error {
  constructor(public status: number, message: string, public data: Record<string, unknown> = {}) {
    super(message);
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-Admin': '1', ...(init.headers ?? {}) },
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new ApiError(res.status, (data.error as string) ?? `Request failed (${res.status}).`, data);
  return data as T;
}

const auth = <T>(action: string, extra: Record<string, unknown> = {}) =>
  call<T>('/api/auth', { method: 'POST', body: JSON.stringify({ action, ...extra }) });

export type Status = { configured: boolean; authenticated: boolean; minPassword: number; email: string };

export const api = {
  status: () => auth<Status>('status'),
  login: (password: string) => auth<{ ok: true }>('login', { password }),
  logout: () => auth<{ ok: true }>('logout'),
  requestOtp: () => auth<{ ok: true }>('request-otp'),
  setPassword: (code: string, password: string) => auth<{ ok: true }>('set-password', { code, password }),
  load: () => call<{ sha: string; files: ContentFiles }>('/api/content'),
  publish: (body: { files: Partial<ContentFiles>; assets: { path: string; base64: string }[]; baseSha: string }) =>
    call<{ ok: true; sha: string }>('/api/content', { method: 'POST', body: JSON.stringify(body) }),
};

// The content files are free-form JSON shaped by the schema in schema.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Obj = Record<string, any>;
export type ContentFiles = {
  profile: Obj;
  projects: Obj[];
  achievements: Obj[];
  repos: Obj[];
  skills: Obj[];
  seasons: Obj[];
  topPicks: Obj[];
  introSlides: Obj[];
  viewers: Obj[];
  sections: Obj;
};
export type FileName = keyof ContentFiles;
