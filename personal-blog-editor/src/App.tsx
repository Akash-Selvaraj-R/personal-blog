import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const LoginPage = lazy(() => import('./pages/Login'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const EditorPage = lazy(() => import('./pages/Editor'));
const BinPage = lazy(() => import('./pages/Bin'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ThemeGate({ children }: { children: React.ReactNode }) {
  const [theme] = useState<string>(() => localStorage.getItem('theme') || 'system');
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PostsProvider>
          <ThemeGate>
            <Suspense fallback={<div className="p-6">Loading...</div>}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editor/:id"
                  element={
                    <ProtectedRoute>
                      <EditorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bin"
                  element={
                    <ProtectedRoute>
                      <BinPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
            <ToastContainer position="bottom-right" />
          </ThemeGate>
        </PostsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
