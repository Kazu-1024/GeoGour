import { GENRES, RANGES } from '../../constants'

type SearchFilterProps = {
    selectedGenre: string
    selectedRange: number
    onGenreChange: (genre: string) => void
    onRangeChange: (range: number) => void
    onSearch: () => void
    isLoading: boolean
}

function SearchFilter({
    selectedGenre,
    selectedRange,
    onGenreChange,
    onRangeChange,
    onSearch,
    isLoading
}: SearchFilterProps) {
    return (
        <div className="bg-bg-card rounded-lg shadow-md p-4 mb-6 border border-border">
            {/* ジャンル選択 */}
            <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    ジャンル
                </label>
                <select
                    value={selectedGenre}
                    onChange={(e) => onGenreChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                >
                    {GENRES.map(genre => (
                        <option key={genre.code} value={genre.code}>
                            {genre.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 範囲選択（セグメントボタン） */}
            <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    検索半径
                </label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                    {RANGES.map((range, index) => (
                        <button
                            key={range.value}
                            onClick={() => onRangeChange(range.value)}
                            className={`flex-1 py-2 text-sm font-medium transition-colors
                                ${selectedRange === range.value
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }
                                ${index !== RANGES.length - 1 ? 'border-r border-gray-300' : ''}
                            `}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 検索ボタン */}
            <button onClick={onSearch} disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {!isLoading && (
                    <span className="material-symbols-outlined text-xl">search</span>
                )}
                {isLoading ? '検索中...' : '現在地で検索'}
            </button>
        </div>
    )
}

export default SearchFilter