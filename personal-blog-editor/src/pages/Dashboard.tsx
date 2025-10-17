import Navbar from '../components/Navbar';
import { usePosts } from '../context/PostsContext';
import { PostList } from '../components/PostList';
import { useNavigate } from 'react-router-dom';
import StatsSidebar from '../components/StatsSidebar';

export default function Dashboard() {
  const { create } = usePosts();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-6 grid gap-6 md:grid-cols-[1fr_280px]">
        <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Posts</h2>
          <button
            onClick={async ()=>{ const p = await create({}); navigate(`/editor/${p.id}`); }}
            className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >New Post</button>
        </div>
        <PostList />
        </div>
        <div>
          <StatsSidebar />
        </div>
      </main>
    </div>
  );
}
