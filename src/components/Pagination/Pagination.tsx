interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): JSX.Element {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) return <></>;

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2 text-white">
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 border border-white/40 bg-gradient-to-b from-black/40 to-black/20 ${
            page === currentPage ? 'bg-accent text-white' : ''
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
