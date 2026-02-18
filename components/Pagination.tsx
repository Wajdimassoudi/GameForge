
import React from 'react';

interface PaginationProps {
    /** The current active page number. */
    currentPage: number;
    /** The total number of pages available. */
    totalPages: number;
    /** Callback function to change the current page. */
    onPageChange: (page: number) => void;
}

/**
 * A smart pagination component that provides controls for navigating through pages.
 * It displays a limited set of page numbers for a clean UI, including first, last,
 * current page, and its immediate neighbors.
 */
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // Return null if there's only one page or no content
    if (totalPages <= 1) {
        return null;
    }
    
    const pageNumbers = [];
    const maxPagesToShow = 5; // The max number of page buttons to show
    let startPage: number, endPage: number;

    // Logic to calculate the range of page numbers to display
    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrent) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPagesBeforeCurrent;
            endPage = currentPage + maxPagesAfterCurrent;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav aria-label="Page navigation" className="flex justify-center items-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors"
            >
                Previous
            </button>

            {startPage > 1 && (
                 <>
                    <button onClick={() => onPageChange(1)} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-cyan-600 transition-colors">1</button>
                    {startPage > 2 && <span className="px-4 py-2 text-gray-400">...</span>}
                </>
            )}
            
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    aria-current={currentPage === number ? 'page' : undefined}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        currentPage === number 
                        ? 'bg-cyan-500 text-white font-bold ring-2 ring-cyan-400' 
                        : 'bg-gray-700 text-white hover:bg-cyan-600'
                    }`}
                >
                    {number}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                     {endPage < totalPages - 1 && <span className="px-4 py-2 text-gray-400">...</span>}
                    <button onClick={() => onPageChange(totalPages)} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-cyan-600 transition-colors">{totalPages}</button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors"
            >
                Next
            </button>
        </nav>
    );
};

export default Pagination;
