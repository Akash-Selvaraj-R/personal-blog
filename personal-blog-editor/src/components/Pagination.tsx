type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const go = (p: number) => onPageChange(Math.min(Math.max(1, p), totalPages));

  const pages = [] as number[];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);

  return (
    <nav className="mt-4 flex items-center gap-2" aria-label="Pagination">
      <button className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800" onClick={() => go(1)} disabled={page===1}>First</button>
      <button className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800" onClick={() => go(page-1)} disabled={page===1}>Prev</button>
      {pages.map((p)=> (
        <button key={p} className={`px-2 py-1 rounded ${p===page? 'bg-blue-600 text-white': 'bg-gray-200 dark:bg-gray-800'}`} onClick={()=>go(p)}>{p}</button>
      ))}
      <button className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800" onClick={() => go(page+1)} disabled={page===totalPages}>Next</button>
      <button className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800" onClick={() => go(totalPages)} disabled={page===totalPages}>Last</button>
    </nav>
  );
}
