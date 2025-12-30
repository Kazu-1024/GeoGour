import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Shop } from '../types/shop'
import type { ApiError } from '../types/error'
import { ErrorCode } from '../types/error'

// 検索パラメータの型
type SearchParams = {
    lat: number
    lng: number
    range: number
    genre?: string
    page?: number
}

// Context の型定義
type SearchContextType = {
    // 状態
    shops: Shop[]
    totalCount: number
    currentPage: number
    totalPages: number
    loading: boolean
    error: ApiError | null
    location: { lat: number; lng: number } | null
    selectedGenre: string
    selectedRange: number
    // アクション
    search: (params: SearchParams) => Promise<void>
    setLocation: (location: { lat: number; lng: number }) => void
    setSelectedGenre: (genre: string) => void
    setSelectedRange: (range: number) => void
    resetFilters: () => void
}

// Context 作成
const SearchContext = createContext<SearchContextType | null>(null)

// Provider コンポーネント
export function SearchProvider({ children }: { children: ReactNode }) {
    const ITEMS_PER_PAGE = 20
    // 状態
    const [shops, setShops] = useState<Shop[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<ApiError | null>(null)
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [selectedGenre, setSelectedGenre] = useState('')
    const [selectedRange, setSelectedRange] = useState(3)

    // 総ページ数を計算
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    // 検索実行
    const search = useCallback(async (params: SearchParams) => {
        setLoading(true)
        setError(null)
        try {
            const page = params.page || 1
            const start = (page - 1) * ITEMS_PER_PAGE + 1
            const query = new URLSearchParams({
                lat: params.lat.toString(),
                lng: params.lng.toString(),
                range: params.range.toString(),
                start: start.toString(),
                count: ITEMS_PER_PAGE.toString(),
            })
            if (params.genre) query.set('genre', params.genre)
            const response = await fetch(`/api/shops?${query}`)

            if (!response.ok) {
                // バックエンドからのAppErrorレスポンスをパース
                const errorData = await response.json().catch(() => null)
                if (errorData?.code) {
                    throw errorData as ApiError
                }
                throw { code: ErrorCode.INTERNAL_SERVER_ERROR, message: '不明なエラーが発生しました' } as ApiError
            }

            const data = await response.json()
            setShops(data.results.shop || [])
            setTotalCount(data.results.results_available || 0)
            setCurrentPage(page)
        } catch (err) {
            // ApiError 型かどうかを判定
            if (err && typeof err === 'object' && 'code' in err) {
                setError(err as ApiError)
            } else if (err instanceof TypeError) {
                // fetchのTypeErrorはネットワークエラー
                setError({ code: ErrorCode.NETWORK_ERROR, message: 'ネットワークエラーが発生しました' })
            } else {
                setError({ code: ErrorCode.INTERNAL_SERVER_ERROR, message: '不明なエラーが発生しました' })
            }
            setShops([])
        } finally {
            setLoading(false)
        }
    }, [])

    // フィルターリセット
    const resetFilters = useCallback(() => {
        setSelectedGenre('')
        setSelectedRange(3)
    }, [])

    return (
        <SearchContext.Provider
            value={{
                shops,
                totalCount,
                currentPage,
                totalPages,
                loading,
                error,
                location,
                selectedGenre,
                selectedRange,
                search,
                setLocation,
                setSelectedGenre,
                setSelectedRange,
                resetFilters,
            }}
        >
            {children}
        </SearchContext.Provider>
    )
}

// カスタムフック
export function useSearch() {
    const context = useContext(SearchContext)
    if (!context) {
        throw new Error('useSearch must be used within SearchProvider')
    }
    return context
}