import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        if (!emailOrUsername || !password) throw new Error('Please enter your username/email and password');
        await login(emailOrUsername, password);
        navigate('/', { replace: true });
      } else if (mode === 'register') {
        if (!email || !username || !password) throw new Error('Please fill all fields');
        await register(email, username, password);
        navigate('/', { replace: true });
      } else {
        toast.info('Password reset link sent if account exists');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Personal Blog Editor</h1>
        <div className="flex justify-center gap-2 mb-4" role="tablist" aria-label="Auth modes">
          <button
            className={`px-3 py-1 rounded ${mode==='login'?'bg-blue-600 text-white':'bg-gray-200 dark:bg-gray-800'}`}
            onClick={() => setMode('login')}
            role="tab"
            aria-selected={mode==='login'}
          >Login</button>
          <button
            className={`px-3 py-1 rounded ${mode==='register'?'bg-blue-600 text-white':'bg-gray-200 dark:bg-gray-800'}`}
            onClick={() => setMode('register')}
            role="tab"
            aria-selected={mode==='register'}
          >Sign up</button>
          <button
            className={`px-3 py-1 rounded ${mode==='forgot'?'bg-blue-600 text-white':'bg-gray-200 dark:bg-gray-800'}`}
            onClick={() => setMode('forgot')}
            role="tab"
            aria-selected={mode==='forgot'}
          >Forgot</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          {mode !== 'register' && (
            <div>
              <label className="block text-sm mb-1">Email or Username</label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                required={mode==='login'}
                autoComplete="username"
              />
            </div>
          )}
          {mode !== 'login' && (
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                required={mode==='register'}
                autoComplete="email"
              />
            </div>
          )}
          {mode === 'register' && (
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                required
                autoComplete="username"
              />
            </div>
          )}
          {mode !== 'forgot' && mode !== 'register' && (
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                required={mode==='login'}
                autoComplete="current-password"
              />
            </div>
          )}
          {mode === 'register' && (
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                required
                autoComplete="new-password"
              />
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Please wait…' : mode === 'login' ? 'Login' : mode === 'register' ? 'Create account' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}
