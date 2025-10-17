import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { memo } from 'react';

type Props = {
  post: Post;
  onDelete: (id: string) => void;
};

function PostCardBase({ post, onDelete }: Props) {
  return (
    <div className="rounded-lg border p-4 bg-white dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <Link to={`/editor/${post.id}`} className="font-semibold hover:underline">
            {post.title || 'Untitled'}
          </Link>
          <div className="text-xs text-gray-500">{dayjs(post.createdAt).format('MMM D, YYYY')}</div>
        </div>
        <button className="text-red-600 text-sm" onClick={() => onDelete(post.id)}>Delete</button>
      </div>
      <p className="text-sm line-clamp-3 mt-2 text-gray-700 dark:text-gray-300">{post.content.slice(0, 160)}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {post.tags?.map((t) => (
          <span key={t} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">#{t}</span>
        ))}
      </div>
    </div>
  );
}

export const PostCard = memo(PostCardBase);
