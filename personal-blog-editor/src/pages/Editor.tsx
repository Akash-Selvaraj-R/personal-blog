import Navbar from '../components/Navbar';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import EditorArea from '../components/EditorArea';
import { usePosts } from '../context/PostsContext';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export default function Editor() {
  const { id } = useParams();
  const { posts, update } = usePosts();
  const post = useMemo(()=> posts.find(p=>p.id===id), [posts, id]);
  const [title, setTitle] = useState(post?.title ?? '');
  const [tags, setTags] = useState<string>(post?.tags?.join(', ') ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const autosaveTimer = useRef<number | null>(null);

  useEffect(() => { if (post) { setTitle(post.title); setTags(post.tags?.join(', ') ?? ''); setContent(post.content); }}, [post]);

  async function onSave() {
    if (!id) return;
    try {
      await update(id, { title, content, tags: tags.split(',').map(t=>t.trim()).filter(Boolean), updatedAt: dayjs().toISOString() });
      toast.success('Saved');
      // Clear local draft
      localStorage.removeItem(`draft_${id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    }
  }

  // Autosave every 30s to localStorage as draft for offline support
  useEffect(() => {
    if (!id) return;
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    autosaveTimer.current = window.setTimeout(() => {
      const draft = { title, tags, content, ts: Date.now() };
      localStorage.setItem(`draft_${id}`, JSON.stringify(draft));
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Auto-save complete');
      }
    }, 30000);
    return () => { if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current); };
  }, [id, title, tags, content]);

  // Load draft if available
  useEffect(() => {
    if (!id) return;
    const raw = localStorage.getItem(`draft_${id}`);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        if (d?.content && d?.ts) {
          setTitle(d.title ?? title);
          setTags(d.tags ?? tags);
          setContent(d.content);
        }
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-xl font-semibold"
          />
          <button onClick={onSave} className="px-3 py-2 rounded bg-blue-600 text-white">Save</button>
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Tags (comma separated)</label>
          <input value={tags} onChange={(e)=>setTags(e.target.value)} className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"/>
        </div>
        <EditorArea value={content} onChange={(v)=>setContent(v)} />
      </main>
    </div>
  );
}
