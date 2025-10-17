import { useState } from 'react';

export default function ClipboardButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="text-sm px-2 py-1 rounded bg-gray-200 dark:bg-gray-800"
      onClick={async ()=>{
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(()=>setCopied(false), 1500);
        } catch {}
      }}
    >{copied ? 'Copied!' : 'Copy link'}</button>
  );
}
