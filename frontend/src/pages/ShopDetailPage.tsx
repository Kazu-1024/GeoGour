import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Shop } from '../types/shop'
import { useViewHistory } from '../hooks/useViewHistory'

function ShopDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const fromHistory = location.state?.from === 'history'
    const [shop, setShop] = useState<Shop | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { addToHistory } = useViewHistory()

    useEffect(() => {
        const fetchShop = async () => {
            if (!id) return

            try {
                setLoading(true)
                const response = await fetch(`/api/shops/${id}`)
                if (!response.ok) {
                    throw new Error('店舗情報の取得に失敗しました')
                }
                const data = await response.json()
                setShop(data)
                addToHistory(data.id)
            } catch (err) {
                setError(err instanceof Error ? err.message : '不明なエラー')
            } finally {
                setLoading(false)
            }
        }
        fetchShop()
    }, [id, addToHistory])

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6">
                <p className="text-center text-gray-500">読み込み中...</p>
            </div>
        )
    }

    if (error || !shop) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {error || '店舗が見つかりませんでした'}
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-primary hover:underline"
                >
                    ← 戻る
                </button>
            </div>
        )
    }

    // Google Maps埋め込み用URL
    const mapUrl = `https://maps.google.com/maps?q=${shop.lat},${shop.lng}&z=16&output=embed`

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* パンくずリスト */}
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-4">
                <Link to="/" className="hover:text-primary">ホーム</Link>
                <span className="material-icons text-xs">chevron_right</span>
                {fromHistory ? (
                    <span className="text-text-muted">最近見たお店</span>
                ) : (
                    <button onClick={() => navigate(-1)} className="hover:text-primary">検索結果</button>
                )}
                <span className="material-icons text-xs">chevron_right</span>
                <span className="text-text truncate max-w-[200px]">{shop.name}</span>
            </nav>

            {/* タイトル・ジャンル・サービス */}
            <section className="mb-6">
                <div className="flex gap-2 mb-2">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{shop.genre.name}</span>
                    {shop.sub_genre?.name && shop.sub_genre.name !== shop.genre.name && (
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">{shop.sub_genre.name}</span>
                    )}
                </div>
                <h1 className="text-2xl font-bold mb-2">{shop.name}</h1>
                {shop.catch && (
                    <p className="text-gray-600 mb-3">{shop.catch}</p>
                )}
                {/* サービスバッジ */}
                <div className="flex flex-wrap gap-2">
                    {shop.free_drink === 'あり' && (
                        <span className="flex items-center gap-1 text-sm bg-primary-light text-primary px-2 py-1 rounded">
                            <span className="material-icons text-base">local_bar</span>飲み放題
                        </span>
                    )}
                    {shop.free_food === 'あり' && (
                        <span className="flex items-center gap-1 text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            <span className="material-icons text-base">restaurant</span>食べ放題
                        </span>
                    )}
                    {shop.card && shop.card !== 'なし' && (
                        <span className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            <span className="material-icons text-base">credit_card</span>カード可
                        </span>
                    )}
                </div>
            </section>

            {/* 画像 */}
            <section className="mb-6">
                <img
                    src={shop.photo.pc.l}
                    alt={shop.name}
                    className="w-full max-h-64 md:max-h-80 lg:max-h-96 object-cover rounded-lg"
                />
            </section>

            {/* 基本情報 */}
            <section className="bg-bg-card rounded-lg shadow p-4 mb-6 border border-border">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">基本情報</h2>
                <div className="space-y-4">
                    {/* 予算 */}
                    {shop.budget?.average && (
                        <div className="flex items-start gap-3">
                            <span className="material-icons text-accent text-xl shrink-0">payments</span>
                            <div className="flex-1">
                                <span className="text-gray-500 text-sm">予算</span>
                                <p className="text-sm">{shop.budget.average}</p>
                            </div>
                        </div>
                    )}

                    {/* 営業時間 */}
                    {shop.open && (
                        <div className="flex items-start gap-3">
                            <span className="material-icons text-gray-400 text-xl shrink-0">schedule</span>
                            <div className="flex-1">
                                <span className="text-gray-500 text-sm">営業時間</span>
                                <p className="text-sm">{shop.open}</p>
                            </div>
                        </div>
                    )}

                    {/* 定休日 */}
                    {shop.close && (
                        <div className="flex items-start gap-3">
                            <span className="material-icons text-gray-400 text-xl shrink-0">event_busy</span>
                            <div className="flex-1">
                                <span className="text-gray-500 text-sm">定休日</span>
                                <p className="text-sm">{shop.close}</p>
                            </div>
                        </div>
                    )}

                    {/* アクセス */}
                    <div className="flex items-start gap-3">
                        <span className="material-icons text-gray-400 text-xl shrink-0">train</span>
                        <div className="flex-1">
                            <span className="text-gray-500 text-sm">アクセス</span>
                            <p className="text-sm">{shop.access}</p>
                        </div>
                    </div>

                    {/* 住所 */}
                    <div className="flex items-start gap-3">
                        <span className="material-icons text-gray-400 text-xl shrink-0">place</span>
                        <div className="flex-1">
                            <span className="text-gray-500 text-sm">住所</span>
                            <p className="text-sm">{shop.address}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* メニュー情報 */}
            <section className="bg-bg-card rounded-lg shadow p-4 mb-6 border border-border">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">メニュー・サービス</h2>
                <div className="space-y-3">
                    {/* 飲み放題 */}
                    <div className="flex items-center gap-3">
                        <span className="material-icons text-primary text-xl">local_bar</span>
                        <div>
                            <span className="text-sm font-medium">飲み放題</span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${shop.free_drink === 'あり' ? 'bg-primary-light text-primary' : 'bg-gray-100 text-gray-500'}`}>
                                {shop.free_drink === 'あり' ? 'あり' : 'なし'}
                            </span>
                        </div>
                    </div>
                    {/* 食べ放題 */}
                    <div className="flex items-center gap-3">
                        <span className="material-icons text-accent text-xl">restaurant</span>
                        <div>
                            <span className="text-sm font-medium">食べ放題</span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${shop.free_food === 'あり' ? 'bg-accent-light text-accent' : 'bg-gray-100 text-gray-500'}`}>
                                {shop.free_food === 'あり' ? 'あり' : 'なし'}
                            </span>
                        </div>
                    </div>
                    {/* カード */}
                    <div className="flex items-center gap-3">
                        <span className="material-icons text-blue-500 text-xl">credit_card</span>
                        <div>
                            <span className="text-sm font-medium">カード</span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${shop.card && shop.card !== 'なし' && shop.card !== '利用不可' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                {shop.card && shop.card !== 'なし' && shop.card !== '利用不可' ? '利用可' : '利用不可'}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 地図 */}
            <section className="mb-6">
                <h2 className="text-lg font-bold mb-4">地図</h2>
                <div className="rounded-lg overflow-hidden">
                    <iframe
                        title="店舗の地図"
                        src={mapUrl}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </section>

            {/* アクションボタン */}
            <section className="sticky bottom-4 mt-8 px-4">
                <a
                    href={shop.urls.pc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-accent hover:bg-accent-dark text-white text-center text-sm font-bold py-4 rounded-lg shadow-lg transition-colors"
                >
                    ホットペッパーグルメで詳細・予約
                </a>
            </section>
        </div>
    )
}

export default ShopDetailPage
