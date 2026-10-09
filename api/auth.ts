// POST /api/auth  { action: 'status' | 'login' | 'logout' | 'request-otp' | 'set-password', ... }
import {
  assertSameOrigin,
  destroySession,
  errorResponse,
  HttpError,
  isConfigured,
  json,
  login,
  MASKED_EMAIL,
  MIN_PASSWORD,
  readCookie,
  resetPassword,
  sendOtp,
  sessionCookie,
  validSession,
} from './_lib/auth.js';

export async function POST(req: Request): Promise<Response> {
  try {
    assertSameOrigin(req);
    const body = (await req.json().catch(() => ({}))) as { action?: string; password?: string; code?: string };
    const sid = readCookie(req);

    switch (body.action) {
      case 'status':
        return json({ configured: await isConfigured(), authenticated: await validSession(sid), minPassword: MIN_PASSWORD, email: MASKED_EMAIL });

      case 'login': {
        if (typeof body.password !== 'string' || !body.password) throw new HttpError(400, 'Enter your password.');
        const id = await login(body.password);
        return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(id) });
      }

      case 'logout':
        await destroySession(sid);
        return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie('', 0) });

      case 'request-otp':
        await sendOtp();
        return json({ ok: true });

      case 'set-password': {
        if (typeof body.code !== 'string' || typeof body.password !== 'string') throw new HttpError(400, 'Enter the code and a new password.');
        const id = await resetPassword(body.code.trim(), body.password);
        return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(id) });
      }

      default:
        throw new HttpError(400, 'Unknown action.');
    }
  } catch (e) {
    return errorResponse(e);
  }
}
