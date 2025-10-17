import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PagedResult, Post, PostsQuery } from '../types';
import { createPost, emptyBin as emptyBinApi, listPosts, restorePost, reorderPosts as reorderApi, softDeletePost, updatePost } from '../services/posts';
import dayjs from 'dayjs';
import { io, Socket } from 'socket.io-client';

interface PostsContextValue {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  query: PostsQuery;
  setQuery: (q: PostsQuery) => void;
  refresh: () => Promise<void>;
  create: (p: Partial<Post>) => Promise<Post>;
  update: (id: string, p: Partial<Post>) => Promise<Post>;
  remove: (id: string) => Promise<void>;
  restore: (id: string) => Promise<Post>;
  reorder: (idsInOrder: string[]) => Promise<void>;
  emptyBin: () => Promise<void>;
}

const PostsContext = createContext<PostsContextValue | undefined>(undefined);

const DEFAULT_PAGE_SIZE = 20;

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<PostsQuery>({ sortBy: 'date', sortDir: 'desc', page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const socketRef = useRef<Socket | null>(null);

  const applyResult = (result: PagedResult<Post>) => {
    setPosts(result.items);
    setTotal(result.total);
    setPage(result.page);
    setPageSize(result.pageSize);
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listPosts(query);
      applyResult(result);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Realtime sync
  useEffect(() => {
    const socket = io('/', { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('posts:changed', () => refresh());
    return () => {
      socket.disconnect();
    };
  }, [refresh]);

  const create = useCallback(async (p: Partial<Post>) => {
    const now = dayjs().toISOString();
    const created = await createPost({
      title: p.title ?? 'Untitled',
      content: p.content ?? '',
      tags: p.tags ?? [],
      createdAt: now,
      updatedAt: now,
    });
    await refresh();
    return created;
  }, [refresh]);

  const update = useCallback(async (id: string, p: Partial<Post>) => {
    const updated = await updatePost(id, { ...p, updatedAt: dayjs().toISOString() });
    await refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await softDeletePost(id);
    await refresh();
  }, [refresh]);

  const restore = useCallback(async (id: string) => {
    const r = await restorePost(id);
    await refresh();
    return r;
  }, [refresh]);

  const reorder = useCallback(async (idsInOrder: string[]) => {
    const orderPayload = idsInOrder.map((id, index) => ({ id, order: index }));
    await reorderApi(orderPayload);
    await refresh();
  }, [refresh]);

  const emptyBin = useCallback(async () => {
    await emptyBinApi();
    await refresh();
  }, [refresh]);

  const value: PostsContextValue = useMemo(() => ({
    posts, total, page, pageSize, loading, query, setQuery, refresh,
    create, update, remove, restore, reorder, emptyBin,
  }), [posts, total, page, pageSize, loading, query, setQuery, refresh, create, update, remove, restore, reorder, emptyBin]);

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts(): PostsContextValue {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}
