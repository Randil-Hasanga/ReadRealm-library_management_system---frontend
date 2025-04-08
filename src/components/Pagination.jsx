const Pagination = ({ currentPage, totalPages, onPageChange, isImportant }) => {
    const range = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
        range.push(i);
    }

    if (start > 1) {
        range.unshift("...");
        range.unshift(1);
    }

    if (end < totalPages) {
        range.push("...");
        range.push(totalPages);
    }

    return (
        <div className="flex justify-end mt-6">
            <button
                className={`bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            {range.map((page, index) => (
                <button
                    key={index}
                    className={`px-4 py-2 rounded-md mx-1 
                        ${(page === currentPage) && isImportant
                            ? "bg-red-500 text-white"
                            : page === "..." ? "bg-transparent text-gray-500 cursor-default" : "bg-gray-300 text-gray-700"
                        }
                        ${page === currentPage
                            ? "bg-orange-500 text-white"
                            : page === "..." ? "bg-transparent text-gray-500 cursor-default" : "bg-gray-300 text-gray-700"
                        }`}
                    onClick={() => typeof page === "number" && onPageChange(page)}
                    disabled={page === "..."}
                >
                    {page}
                </button>
            ))}
            <button
                className={`bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;