import { useMemo } from 'react';
import { usePosts } from '../context/PostsContext';

export default function StatsSidebar() {
  const { posts } = usePosts();
  const stats = useMemo(() => {
    const total = posts.length;
    const words = posts.reduce((acc, p) => acc + p.content.split(/\s+/).filter(Boolean).length, 0);
    return { total, words };
  }, [posts]);

  return (
    <aside className="rounded-lg border p-4 bg-white dark:bg-gray-900">
      <h3 className="font-semibold mb-2">Stats</h3>
      <div className="text-sm space-y-1">
        <div>Total posts: {stats.total}</div>
        <div>Total words: {stats.words}</div>
      </div>
    </aside>
  );
}
