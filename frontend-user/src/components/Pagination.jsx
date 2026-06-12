import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg border transition-colors ${
          currentPage === 1 
            ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Previous page"
      >
        <FiChevronLeft size={20} />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            currentPage === page
              ? 'bg-[var(--color-primary-600)] text-white border border-[var(--color-primary-600)] shadow-sm'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg border transition-colors ${
          currentPage === totalPages 
            ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Next page"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
}
