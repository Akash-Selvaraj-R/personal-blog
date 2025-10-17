import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Profile</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"/>
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"/>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800">Close</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
        </div>
      </div>
    </div>
  );
}
