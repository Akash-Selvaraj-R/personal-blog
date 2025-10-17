import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { FaMoon, FaRegTrashAlt, FaSignOutAlt, FaSun, FaUser } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className="sticky top-0 z-10 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div className="container flex items-center gap-4 py-3">
        <Link to="/" className="font-semibold">Blog Editor</Link>
        <NavLink to="/" className={({isActive})=>`text-sm ${isActive?'text-blue-600':'text-gray-600 dark:text-gray-300'}`}>Dashboard</NavLink>
        <NavLink to="/bin" className={({isActive})=>`text-sm flex items-center gap-1 ${isActive?'text-blue-600':'text-gray-600 dark:text-gray-300'}`}><FaRegTrashAlt/> Bin</NavLink>
        <div className="ml-auto flex items-center gap-3">
          <button aria-label="Toggle theme" onClick={() => setTheme(theme==='dark'?'light':theme==='light'?'system':'dark')} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            {document.documentElement.classList.contains('dark') ? <FaSun/> : <FaMoon/>}
          </button>
          <div className="text-sm flex items-center gap-2">
            <FaUser/>
            <span>{user?.username || user?.email}</span>
          </div>
          <button onClick={async ()=>{ await logout(); navigate('/login'); }} className="text-sm flex items-center gap-1 px-3 py-1 rounded bg-gray-200 dark:bg-gray-800">
            <FaSignOutAlt/> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
