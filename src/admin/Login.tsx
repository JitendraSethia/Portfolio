import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { api, ApiError, type Status } from './api';

type Mode = 'login' | 'send' | 'otp';

export default function Login({ status, onDone }: { status: Status; onDone: () => void }) {
  const [mode, setMode] = useState<Mode>(status.configured ? 'login' : 'send');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (e) {
      const err = e as ApiError;
      const wait = Number(err.data?.retryAfter);
      setError(wait ? `${err.message} (${Math.ceil(wait / 60)} min)` : err.message);
    } finally {
      setBusy(false);
    }
  };

  const sendCode = () =>
    run(async () => {
      await api.requestOtp();
      setMode('otp');
      setCode('');
      setPassword('');
      setConfirm('');
      setCooldown(60);
      setInfo(`We sent a 6-digit code to ${status.email}. It expires in 10 minutes.`);
    });

  const submitLogin = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await api.login(password);
      onDone();
    });
  };

  const submitReset = (e: FormEvent) => {
    e.preventDefault();
    if (password.length < status.minPassword) return setError(`Use at least ${status.minPassword} characters.`);
    if (password !== confirm) return setError('The two passwords don’t match.');
    run(async () => {
      await api.setPassword(code, password);
      onDone();
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-5xl leading-none tracking-wide text-bone">
            <span className="text-crimson">J</span> SERIES
          </p>
          <p className="mt-1 text-[11px] font-bold tracking-[0.4em] text-mist">ADMIN</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-2 p-6 shadow-2xl">
          {mode === 'login' && (
            <form onSubmit={submitLogin} className="space-y-4">
              <Field label="Password">
                <input className="field" type="password" autoComplete="current-password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>
              <Messages error={error} />
              <button className="btn btn-primary w-full" disabled={busy || !password}>
                {busy ? 'Checking…' : 'Log in'}
              </button>
              <button type="button" className="w-full text-center text-xs text-mist hover:text-bone" onClick={() => (setMode('send'), setError(''), setInfo(''))}>
                Forgot password?
              </button>
            </form>
          )}

          {mode === 'send' && (
            <div className="space-y-4">
              <h1 className="text-lg font-semibold text-bone">{status.configured ? 'Reset your password' : 'Set up your admin'}</h1>
              <p className="text-sm leading-relaxed text-mist">
                {status.configured ? 'We’ll email a one-time code to ' : 'No password is set yet. We’ll email a one-time code to '}
                <span className="font-semibold text-bone">{status.email}</span>
                {status.configured ? ' so you can choose a new one.' : ', then you’ll choose your password.'}
              </p>
              <Messages error={error} />
              <button className="btn btn-primary w-full" disabled={busy} onClick={sendCode}>
                {busy ? 'Sending…' : 'Email me a code'}
              </button>
              {status.configured && (
                <button type="button" className="w-full text-center text-xs text-mist hover:text-bone" onClick={() => (setMode('login'), setError(''))}>
                  ← Back to login
                </button>
              )}
            </div>
          )}

          {mode === 'otp' && (
            <form onSubmit={submitReset} className="space-y-4">
              <Messages info={info} error={error} />
              <Field label="6-digit code">
                <input
                  className="field text-center font-mono text-2xl tracking-[0.5em]"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                />
              </Field>
              <Field label="New password" hint={`At least ${status.minPassword} characters.`}>
                <input className="field" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>
              <Field label="Repeat new password">
                <input className="field" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </Field>
              <button className="btn btn-primary w-full" disabled={busy || code.length !== 6 || !password || !confirm}>
                {busy ? 'Saving…' : 'Save password & log in'}
              </button>
              <div className="flex justify-between text-xs text-mist">
                <button type="button" className="hover:text-bone disabled:opacity-40" disabled={cooldown > 0 || busy} onClick={sendCode}>
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                </button>
                {status.configured && (
                  <button type="button" className="hover:text-bone" onClick={() => (setMode('login'), setError(''))}>
                    Back to login
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-smoke">
          <a href="/" className="hover:text-mist">
            ← Back to the site
          </a>
        </p>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-bone">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-smoke">{hint}</span>}
    </label>
  );
}

function Messages({ error, info }: { error?: string; info?: string }) {
  return (
    <>
      {info && <p className="rounded-lg bg-ok/10 px-3 py-2 text-xs leading-relaxed text-ok">{info}</p>}
      {error && (
        <p role="alert" className="rounded-lg bg-crimson/15 px-3 py-2 text-xs leading-relaxed text-crimson-2">
          {error}
        </p>
      )}
    </>
  );
}
