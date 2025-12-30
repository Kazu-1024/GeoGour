import { GENRES, RANGES } from '../../constants'

type ActiveFiltersProps = {
    selectedGenre: string
    selectedRange: number
    onGenreReset: () => void
}

function ActiveFilters({ selectedGenre, selectedRange, onGenreReset }: ActiveFiltersProps) {
    const genreName = GENRES.find(g => g.code === selectedGenre)?.name
    const rangeLabel = RANGES.find(r => r.value === selectedRange)?.label

    return (
        <div className="flex flex-wrap items-center gap-2 mb-4 border border-border p-2 rounded-xl">
            {/* 検索半径バッジ */}
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-bg-card text-white text-sm rounded-full">
                <span className="material-icons text-base text-primary">place</span>
                <span className="text-primary">{rangeLabel}</span>
            </span>

            {/* ジャンルバッジ（選択時のみ） */}
            {selectedGenre && genreName && (
                <button
                    onClick={onGenreReset}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-bg-card border border-border text-text text-sm rounded-full hover:bg-gray-100 transition-colors"
                >
                    {genreName}
                    <span className="material-icons text-base text-text-muted">close</span>
                </button>
            )}
        </div>
    )
}

export default ActiveFilters
