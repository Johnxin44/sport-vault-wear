export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 text-sm font-semibold transition-colors border
            ${p === page
              ? 'bg-brand-amber text-black border-brand-amber'
              : 'border-white/10 text-gray-400 hover:border-brand-amber hover:text-brand-amber'}`}
        >
          {p}
        </button>
      ))}
    </div>
  )
}
