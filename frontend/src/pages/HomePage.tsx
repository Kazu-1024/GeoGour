import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGeolocation } from '../hooks/useGeolocation'
import { useViewHistory } from '../hooks/useViewHistory'
import SearchFilter from '../components/search/SearchFilter'
import RecentlyViewed from '../components/search/RecentlyViewed'
import logo from '../assets/Geogour_logo.png'

function HomePage() {
    const navigate = useNavigate()
    const { location, loading: geoLoading, error: geoError, getLocation } = useGeolocation()
    const { historyIds } = useViewHistory()
    const [genre, setGenre] = useState('')
    const [range, setRange] = useState(3)
    const [shouldSearch, setShouldSearch] = useState(false)

    // 検索ボタン押下時
    const handleSearch = () => {
        setShouldSearch(true)
        getLocation()
    }

    // 位置情報取得後に検索ページへ遷移
    useEffect(() => {
        if (shouldSearch && !geoLoading) {
            if (geoError) {
                // エラー時もSearchに遷移
                navigate('/search?error=geolocation')
            } else if (location) {
                const params = new URLSearchParams({
                    lat: location.lat.toString(),
                    lng: location.lng.toString(),
                    range: range.toString(),
                })
                if (genre) params.set('genre', genre)
                navigate(`/search?${params.toString()}`)
            }
        }
    }, [shouldSearch, location, geoLoading, geoError, genre, range, navigate])

    return (
        <div className="flex-1 flex flex-col items-center pt-16 px-4">
            {/* ロゴ */}
            <div className="text-center mb-8">
                <img src={logo} alt="GeoGour" className="h-16 md:h-20 lg:h-24 mx-auto mb-2 ml-1 md:ml-3 lg:ml-6" />
                <p className="text-text-muted text-sm">現在地から近い飲食店を検索</p>
            </div>
            {/* 検索フィルター */}
            <div className="w-full max-w-4xl">
                <SearchFilter
                    selectedGenre={genre}
                    selectedRange={range}
                    onGenreChange={setGenre}
                    onRangeChange={setRange}
                    onSearch={handleSearch}
                    isLoading={geoLoading}
                />
            </div>
            {/* 最近見たお店 */}
            {historyIds.length > 0 && (
                <div className="w-full max-w-4xl mt-12">
                    <RecentlyViewed historyIds={historyIds} />
                </div>
            )}
        </div>
    )
}
export default HomePage