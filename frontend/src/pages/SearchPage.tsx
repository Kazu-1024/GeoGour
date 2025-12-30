import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGeolocation } from '../hooks/useGeolocation'
import { useSearch } from '../contexts/SearchContext'
import SearchFilter from '../components/search/SearchFilter'
import ActiveFilters from '../components/search/ActiveFilters'
import ShopCard from '../components/shop/ShopCard'
import Pagination from '../components/common/Pagination'
import ErrorAlert from '../components/common/ErrorAlert'
import { ErrorCode } from '../types/error'
import type { ApiError } from '../types/error'

function SearchPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // フック呼び出しは1回
    const { location: geoLocation, loading: geoLoading, error: geoError, getLocation } = useGeolocation()
    const {
        shops,
        totalCount,
        currentPage,
        totalPages,
        loading: searchLoading,
        error: searchError,
        selectedGenre,
        selectedRange,
        location,
        setSelectedGenre,
        setSelectedRange,
        setLocation,
        search,
    } = useSearch()

    // 一度に取得する店舗数
    const ITEMS_PER_PAGE = 20

    // クエリパラメータが変わったかどうか
    const prevParamsRef = useRef<string | null>(null)

    // 初回ロード時またはクエリパラメータ変更時に検索
    useEffect(() => {
        const currentParams = searchParams.toString()

        // 同じパラメータで既にデータがある場合はスキップ（ブラウザバック対応）
        if (shops.length > 0 && prevParamsRef.current === currentParams) {
            return
        }
        prevParamsRef.current = currentParams

        const lat = searchParams.get('lat')
        const lng = searchParams.get('lng')
        const rangeParam = searchParams.get('range')
        const genreParam = searchParams.get('genre')
        const errorParam = searchParams.get('error')

        if (errorParam === 'geolocation') {
            getLocation()
            return
        }

        if (lat && lng) {
            // クエリパラメータから検索実行
            const newLocation = { lat: parseFloat(lat), lng: parseFloat(lng) }
            if (rangeParam) setSelectedRange(parseInt(rangeParam))
            if (genreParam) setSelectedGenre(genreParam)
            setLocation(newLocation)
            search({
                lat: newLocation.lat,
                lng: newLocation.lng,
                range: rangeParam ? parseInt(rangeParam) : selectedRange,
                genre: genreParam || undefined
            })
        }
    }, [searchParams])  // searchParamsが変わったら再実行

    // 位置情報ボタンから取得した場合
    useEffect(() => {
        if (geoLocation && !searchParams.get('lat')) {
            setLocation(geoLocation)
            search({
                lat: geoLocation.lat,
                lng: geoLocation.lng,
                range: selectedRange,
                genre: selectedGenre || undefined
            })
        }
    }, [geoLocation])

    const handleSearch = () => {
        // キャッシュをリセットして再検索
        prevParamsRef.current = null

        if (location) {
            // 既存の位置情報で再検索
            search({
                lat: location.lat,
                lng: location.lng,
                range: selectedRange,
                genre: selectedGenre || undefined
            })
        } else {
            // 位置情報がなければ取得
            getLocation()
        }
    }
    const handlePageChange = (page: number) => {
        if (location) {
            search({
                lat: location.lat,
                lng: location.lng,
                range: selectedRange,
                genre: selectedGenre || undefined,
                page
            })
        }
    }
    const handleShopClick = (shopId: string) => {
        navigate(`/shop/${shopId}`)
    }
    const handleGenreReset = () => {
        setSelectedGenre('')
        if (location) {
            search({
                lat: location.lat,
                lng: location.lng,
                range: selectedRange,
                genre: undefined
            })
        }
    }
    const isLoading = geoLoading || searchLoading
    const error: ApiError | null = geoError
        ? { code: ErrorCode.GEOLOCATION_ERROR, message: geoError }
        : searchError
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalCount)
    const handleRetry = () => {
        getLocation()
    }
    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <SearchFilter
                selectedGenre={selectedGenre}
                selectedRange={selectedRange}
                onGenreChange={setSelectedGenre}
                onRangeChange={setSelectedRange}
                onSearch={handleSearch}
                isLoading={isLoading}
            />

            <ErrorAlert error={error} onRetry={handleRetry} />

            {shops.length > 0 && (
                <>
                    <h2 className="text-lg font-light text-text mb-3">検索結果一覧</h2>

                    {/* フィルターバッジ */}
                    <ActiveFilters
                        selectedGenre={selectedGenre}
                        selectedRange={selectedRange}
                        onGenreReset={handleGenreReset}
                    />

                    <p className="text-text-muted my-4">
                        <span className="text-xl font-bold text-text">{totalCount}</span>
                        <span className="text-sm ml-1">件</span>
                        <span className="text-sm ml-2">（{startItem}〜{endItem}件）</span>
                    </p>
                    <div className="space-y-4">
                        {shops.map(shop => (
                            <ShopCard
                                key={shop.id}
                                shop={shop}
                                onClick={() => handleShopClick(shop.id)}
                            />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {!isLoading && !error && location && shops.length === 0 && (
                <p className="text-center text-text-muted">周辺に店舗が見つかりませんでした</p>
            )}
        </div>
    )
}

export default SearchPage