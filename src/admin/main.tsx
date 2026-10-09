import { StrictMode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api, type Status } from './api';
import Editor from './Editor';
import Login from './Login';
import './admin.css';

function Admin() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState('');

  const refresh = useCallback(() => {
    setError('');
    api
      .status()
      .then(setStatus)
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(refresh, [refresh]);

  if (error)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-crimson-2">{error}</p>
        <button className="btn btn-ghost" onClick={refresh}>
          Try again
        </button>
      </div>
    );
  if (!status) return <div className="flex min-h-screen items-center justify-center text-sm text-mist">Loading…</div>;
  if (!status.authenticated) return <Login status={status} onDone={refresh} />;
  return <Editor onLogout={refresh} />;
}

createRoot(document.getElementById('admin')!).render(
  <StrictMode>
    <Admin />
  </StrictMode>,
);
