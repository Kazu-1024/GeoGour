type PaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    const handlePageChange = (page: number) => {
        onPageChange(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            }
        }
        return pages
    }

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="material-icons text-xl">chevron_left</span>
            </button>

            {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                    <button
                        key={index}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg ${currentPage === page
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={index} className="px-2">...</span>
                )
            ))}

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="material-icons text-xl">chevron_right</span>
            </button>
        </div>
    )
}

export default Pagination