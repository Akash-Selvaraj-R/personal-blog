import Navbar from '../components/Navbar';
import { useEffect, useMemo, useState } from 'react';
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

  useEffect(() => { if (post) { setTitle(post.title); setTags(post.tags?.join(', ') ?? ''); setContent(post.content); }}, [post]);

  async function onSave() {
    if (!id) return;
    try {
      await update(id, { title, content, tags: tags.split(',').map(t=>t.trim()).filter(Boolean), updatedAt: dayjs().toISOString() });
      toast.success('Saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    }
  }

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
