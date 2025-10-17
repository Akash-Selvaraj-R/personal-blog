import { useEffect, useState } from 'react';
// import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { toast } from 'react-toastify';

// Lightweight markdown editor: textarea + markdown preview instead of ReactQuill
// to avoid React 19 peer conflicts. Supports image paste and autosave.

type Props = {
  value: string;
  onChange: (value: string) => void;
  onUploadImage?: (file: File) => Promise<string>; // returns URL
};

export default function EditorArea({ value, onChange, onUploadImage }: Props) {
  const [content, setContent] = useState(value);
  const [preview, setPreview] = useState(false);

  useEffect(() => setContent(value), [value]);

  useEffect(() => {
    // Ensure Notification permission is requested upfront for later use in parent autosave
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const onPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!onUploadImage) return;
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith('image/'));
    if (item) {
      const file = item.getAsFile();
      if (file) {
        try {
          const url = await onUploadImage(file);
          setContent((c) => `${c}\n\n![image](${url})`);
          toast.success('Image uploaded');
        } catch (err: any) {
          toast.error(err.message || 'Image upload failed');
        }
      }
    }
  };

  // Preview uses ReactMarkdown with rehype-sanitize; additional DOMPurify available if needed

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1 text-sm rounded bg-gray-200 dark:bg-gray-800"
          onClick={() => setPreview((p) => !p)}
          aria-pressed={preview}
        >{preview ? 'Edit' : 'Preview'}</button>
        <button
          className="px-2 py-1 text-sm rounded bg-gray-200 dark:bg-gray-800"
          onClick={() => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen();
            else document.exitFullscreen();
          }}
        >Toggle Fullscreen</button>
      </div>
      {!preview ? (
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); onChange(e.target.value); }}
          onPaste={onPaste}
          className="w-full min-h-[60vh] rounded border p-3 bg-white dark:bg-gray-900 font-mono"
          aria-label="Post content"
          placeholder="Write your post in Markdown…"
        />
      ) : (
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
