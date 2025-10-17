export type User = {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  token: string; // JWT or session token
};

export type Tag = string;

export type Post = {
  id: string;
  title: string;
  content: string; // markdown content
  html?: string; // cached rendered HTML (optional)
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  tags: Tag[];
  isDeleted?: boolean;
  order?: number; // for manual ordering
};

export type PostsQuery = {
  search?: string;
  sortBy?: 'date' | 'title';
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  includeDeleted?: boolean;
};

export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
