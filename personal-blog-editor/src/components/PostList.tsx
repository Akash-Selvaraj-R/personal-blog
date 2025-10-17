import { memo, useMemo, useState } from 'react';
import { usePosts } from '../context/PostsContext';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PostCard } from './PostCard';
import { debounce } from '../utils/debounce';
import Pagination from './Pagination';

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

function PostListBase() {
  const { posts, remove, reorder, query, setQuery, page, pageSize, total } = usePosts();
  const [search, setSearch] = useState(query.search ?? '');

  const sensors = useSensors(useSensor(PointerSensor));

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = posts.findIndex((p: any) => p.id === active.id);
    const newIndex = posts.findIndex((p: any) => p.id === over.id);
    const newOrder = arrayMove(posts, oldIndex, newIndex).map((p: any) => p.id);
    await reorder(newOrder);
  };

  const debouncedSetQuery = useMemo(() => debounce((value: string) => setQuery({ ...query, search: value, page: 1 }), 300), [query, setQuery]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); debouncedSetQuery(e.target.value); }}
          placeholder="Search by title or tag…"
          className="w-full md:max-w-sm rounded border px-3 py-2 bg-white dark:bg-gray-800"
          aria-label="Search posts"
        />
        <select
          value={`${query.sortBy}|${query.sortDir}`}
          onChange={(e)=>{
            const [sortBy, sortDir] = e.target.value.split('|') as any;
            setQuery({ ...query, sortBy, sortDir });
          }}
          className="rounded border px-3 py-2 bg-white dark:bg-gray-800"
          aria-label="Sort posts"
        >
          <option value="date|desc">Newest</option>
          <option value="date|asc">Oldest</option>
          <option value="title|asc">A-Z</option>
          <option value="title|desc">Z-A</option>
        </select>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={posts.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <SortableItem id={p.id} key={p.id}>
                <PostCard post={p} onDelete={(id)=>remove(id)} />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="flex justify-center">
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={(p)=> setQuery({ ...query, page: p })} />
      </div>
    </div>
  );
}

export const PostList = memo(PostListBase);
