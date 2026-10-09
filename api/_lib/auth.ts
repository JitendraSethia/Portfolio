// Single-admin auth: password only, OTP to a fixed email for first setup and resets.
// State lives in Upstash Redis; nothing secret is stored in the repo.
import { Redis } from '@upstash/redis';
import { createHash, randomBytes, randomInt, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'jitendrasethia053@gmail.com';

/** j•••••@gmail.com — enough to recognise the inbox without publishing the address. */
export const MASKED_EMAIL = ADMIN_EMAIL.replace(/^(.{2})[^@]*/, (_m, start: string) => start + '•••••');

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
export const redis = url && token ? new Redis({ url, token }) : null;

const K = {
  hash: 'admin:pw:hash',
  version: 'admin:pw:version',
  session: (id: string) => `admin:session:${id}`,
  fails: 'admin:login:fails',
  otp: 'admin:otp',
  otpTries: 'admin:otp:tries',
  otpSent: 'admin:otp:sent',
};

export const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days
export const MAX_LOGIN_FAILS = 5;
export const LOCK_SECONDS = 15 * 60;
const OTP_TTL = 10 * 60;
const MAX_OTP_TRIES = 5;
const MAX_OTP_SENDS = 3; // per 15 minutes
export const MIN_PASSWORD = 10;

function db(): Redis {
  if (!redis) throw new HttpError(500, 'Storage is not configured (Upstash env vars missing).');
  return redis;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public extra: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

// ---------- password ----------

export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(pw, salt, 64);
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
}

async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  const [, saltB64, keyB64] = stored.split('$');
  const expected = Buffer.from(keyB64, 'base64');
  const key = await scrypt(pw, Buffer.from(saltB64, 'base64'), expected.length);
  return timingSafeEqual(key, expected);
}

export async function isConfigured(): Promise<boolean> {
  return (await db().exists(K.hash)) === 1;
}

/** Checks the password with a lockout after repeated failures. Returns a new session id. */
export async function login(pw: string): Promise<string> {
  const r = db();
  const fails = Number((await r.get(K.fails)) ?? 0);
  if (fails >= MAX_LOGIN_FAILS) {
    const ttl = await r.ttl(K.fails);
    throw new HttpError(429, 'Too many wrong attempts. Try again later.', { retryAfter: Math.max(ttl, 1) });
  }
  const stored = await r.get<string>(K.hash);
  if (!stored) throw new HttpError(409, 'No password set yet.');
  if (!(await verifyPassword(pw, stored))) {
    const n = await r.incr(K.fails);
    if (n === 1) await r.expire(K.fails, LOCK_SECONDS);
    const left = MAX_LOGIN_FAILS - n;
    throw new HttpError(401, left > 0 ? `Wrong password. ${left} attempt${left === 1 ? '' : 's'} left.` : 'Too many wrong attempts. Login is locked for 15 minutes.', {
      attemptsLeft: Math.max(left, 0),
    });
  }
  await r.del(K.fails);
  return createSession();
}

// ---------- sessions ----------

async function createSession(): Promise<string> {
  const r = db();
  const id = randomBytes(32).toString('hex');
  const version = Number((await r.get(K.version)) ?? 0);
  await r.set(K.session(id), version, { ex: SESSION_TTL });
  return id;
}

export async function validSession(id: string | undefined): Promise<boolean> {
  if (!id || !/^[a-f0-9]{64}$/.test(id) || !redis) return false;
  const [v, current] = await Promise.all([redis.get(K.session(id)), redis.get(K.version)]);
  return v !== null && Number(v) === Number(current ?? 0);
}

export async function destroySession(id: string | undefined) {
  if (id && redis) await redis.del(K.session(id));
}

// ---------- OTP ----------

const sha = (s: string) => createHash('sha256').update(s).digest('hex');

export async function sendOtp(): Promise<void> {
  const r = db();
  const sent = await r.incr(K.otpSent);
  if (sent === 1) await r.expire(K.otpSent, LOCK_SECONDS);
  if (sent > MAX_OTP_SENDS) {
    const ttl = await r.ttl(K.otpSent);
    throw new HttpError(429, 'Too many codes requested. Try again later.', { retryAfter: Math.max(ttl, 1) });
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  await r.set(K.otp, sha(code), { ex: OTP_TTL });
  await r.del(K.otpTries);
  await sendEmail(code);
}

/** Verifies the OTP (single use, limited tries) and sets a new password. Logs out every other session. */
export async function resetPassword(code: string, newPassword: string): Promise<string> {
  const r = db();
  if (newPassword.length < MIN_PASSWORD) throw new HttpError(400, `Password must be at least ${MIN_PASSWORD} characters.`);
  const stored = await r.get<string>(K.otp);
  if (!stored) throw new HttpError(400, 'Code expired. Request a new one.');
  const tries = await r.incr(K.otpTries);
  if (tries > MAX_OTP_TRIES) {
    await r.del(K.otp);
    throw new HttpError(429, 'Too many wrong codes. Request a new one.');
  }
  const ok = /^\d{6}$/.test(code) && timingSafeEqual(Buffer.from(sha(code)), Buffer.from(stored));
  if (!ok) throw new HttpError(400, `Wrong code. ${MAX_OTP_TRIES - tries} tr${MAX_OTP_TRIES - tries === 1 ? 'y' : 'ies'} left.`);

  await r.del(K.otp, K.otpTries, K.fails);
  await r.set(K.hash, await hashPassword(newPassword));
  await r.incr(K.version); // invalidates every existing session
  return createSession();
}

async function sendEmail(code: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new HttpError(500, 'Email is not configured (RESEND_API_KEY missing).');
  // Checked up front so a mis-pasted key fails with a clear message instead of a runtime error that could echo it.
  if (!/^re_[A-Za-z0-9_]+$/.test(apiKey)) throw new HttpError(500, 'The email key in Vercel (RESEND_API_KEY) is not valid. Paste it once, with no spaces.');
  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.ADMIN_EMAIL_FROM ?? 'Portfolio Admin <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject: `${code} is your portfolio admin code`,
        text: `Your code is ${code}\n\nIt expires in 10 minutes and works once. If you didn't ask for this, ignore this email — your password hasn't changed.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;background:#0e0e13;color:#f4f1ec;border-radius:12px">
        <p style="margin:0 0 4px;color:#ff3d5a;font-size:11px;letter-spacing:3px;font-weight:bold">PORTFOLIO ADMIN</p>
        <p style="margin:0 0 20px;color:#a7a6ad">Your one-time code:</p>
        <p style="margin:0 0 20px;font-size:36px;letter-spacing:10px;font-weight:bold">${code}</p>
        <p style="margin:0;color:#a7a6ad;font-size:13px">Expires in 10 minutes and works once. If you didn't ask for this, ignore this email — your password hasn't changed.</p>
      </div>`,
      }),
    });
  } catch {
    throw new HttpError(502, 'Could not reach the email service. Try again in a minute.');
  }
  if (!res.ok) throw new HttpError(502, `Could not send the email (${res.status}).`);
}

// ---------- HTTP helpers ----------

export const COOKIE = 'admin_session';

export function readCookie(req: Request, name = COOKIE): string | undefined {
  const raw = req.headers.get('cookie') ?? '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return undefined;
}

export function sessionCookie(id: string, maxAge = SESSION_TTL): string {
  return `${COOKIE}=${id}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}

/** Cross-site requests can't send this header without a CORS preflight, which we never allow. */
export function assertSameOrigin(req: Request) {
  if (req.headers.get('x-admin') !== '1') throw new HttpError(403, 'Forbidden.');
}

/** Strips anything that looks like a credential before it can reach the logs. */
export function redact(text: string): string {
  return text
    .replace(/Bearer\s+[^\s"']+/gi, 'Bearer [redacted]')
    .replace(/\b(re_|github_pat_|ghp_|gho_|ghs_)[A-Za-z0-9_]+/g, '$1[redacted]')
    .replace(/\b[A-Za-z0-9_-]{32,}\b/g, '[redacted]');
}

export function errorResponse(e: unknown): Response {
  if (e instanceof HttpError) return json({ error: e.message, ...e.extra }, e.status);
  const err = e instanceof Error ? e : new Error(String(e));
  console.error(redact(`${err.name}: ${err.message}\n${err.stack ?? ''}`));
  return json({ error: 'Something went wrong.' }, 500);
}
