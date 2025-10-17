import api from './api';
import type { PagedResult, Post, PostsQuery } from '../types';

export async function listPosts(query: PostsQuery): Promise<PagedResult<Post>> {
  const { data } = await api.get<PagedResult<Post>>('/posts', { params: query });
  return data;
}

export async function getPost(id: string): Promise<Post> {
  const { data } = await api.get<Post>(`/posts/${id}`);
  return data;
}

export async function createPost(payload: Partial<Post>): Promise<Post> {
  const { data } = await api.post<Post>('/posts', payload);
  return data;
}

export async function updatePost(id: string, payload: Partial<Post>): Promise<Post> {
  const { data } = await api.put<Post>(`/posts/${id}`, payload);
  return data;
}

export async function softDeletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}

export async function restorePost(id: string): Promise<Post> {
  const { data } = await api.post<Post>(`/posts/${id}/restore`, {});
  return data;
}

export async function emptyBin(): Promise<void> {
  await api.post('/posts/bin/empty', {});
}

export async function reorderPosts(order: { id: string; order: number }[]): Promise<void> {
  await api.post('/posts/reorder', { order });
}
