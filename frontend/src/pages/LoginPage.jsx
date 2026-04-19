
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/resources', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleDevLogin = (role) => {
    // Dev mode - bypass OAuth with fake JWT
    const fakePayload = {
      sub: role === 'ADMIN' ? 'admin@sliit.lk' : 'user@sliit.lk',
      email: role === 'ADMIN' ? 'admin@sliit.lk' : 'user@sliit.lk',
      name: role === 'ADMIN' ? 'Admin User' : 'Normal User',
      roles: [role],
    };
    const fakeToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' +
      btoa(JSON.stringify(fakePayload)) + '.fake-signature';
    login(fakeToken);
    navigate('/resources', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 px-4">
      <div className="w-full max-w-lg">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_35px_100px_-40px_rgba(59,130,246,0.35)]">
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-10 text-white sm:px-12 sm:py-12">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 shadow-lg shadow-black/10">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h1 className="text-3xl font-semibold">Smart Campus Hub</h1>
              <p className="mt-3 max-w-md text-sm text-blue-100/90">
                Member 1 UI for campus facilities management. Sign in to view available resources, manage assets, and keep all campus operations organized.
              </p>
            </div>
          </div>

          <div className="px-8 py-8 sm:px-12 sm:py-10">
            <p className="text-sm font-medium text-gray-700 mb-4">Development login (no OAuth required)</p>
            <div className="grid gap-4">
              <button
                onClick={() => handleDevLogin('ADMIN')}
                className="flex w-full items-center justify-center gap-3 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
              >
                Login as ADMIN
              </button>
              <button
                onClick={() => handleDevLogin('USER')}
                className="flex w-full items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Login as USER
              </button>
            </div>
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
              <p><span className="font-semibold text-slate-700">Note:</span> This project uses a dev-mode login for the assignment flow. Choose ADMIN to manage resources or USER to browse the campus catalog.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



