import Navbar from '../components/Navbar';
import { usePosts } from '../context/PostsContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Bin() {
  const { posts, restore, emptyBin } = usePosts();
  const deleted = posts.filter((p) => p.isDeleted);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Bin</h2>
          <button onClick={emptyBin} className="px-3 py-2 rounded bg-red-600 text-white">Empty Bin</button>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {deleted.map((p) => (
              <motion.div key={p.id} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, scale:0.98}} className="rounded-lg border p-4 bg-white dark:bg-gray-900">
                <div className="font-semibold">{p.title}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{p.content.slice(0,160)}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={()=>restore(p.id)} className="text-sm px-2 py-1 rounded bg-green-600 text-white">Restore</button>
                  <button onClick={()=>{/* TODO: permanent delete endpoint */}} className="text-sm px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">Delete Forever</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
