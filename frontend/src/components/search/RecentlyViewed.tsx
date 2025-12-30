import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Shop } from '../../types/shop'

type ViewHistoryItem = {
    id: string
    viewedAt: number
}

type Props = {
    historyIds: ViewHistoryItem[]
}

function RecentlyViewed({ historyIds }: Props) {
    const [shops, setShops] = useState<Shop[]>([])
    const [loading, setLoading] = useState(true)
    // IDリストからショップ情報を取得
    useEffect(() => {
        const fetchShops = async () => {
            if (historyIds.length === 0) {
                setLoading(false)
                return
            }
            try {
                // 各IDで個別に取得（将来的には一括取得APIを作成）
                const promises = historyIds.slice(0, 5).map(async (item) => {
                    const res = await fetch(`/api/shops/${item.id}`)
                    if (!res.ok) return null
                    return res.json()
                })

                const results = await Promise.all(promises)
                setShops(results.filter((s): s is Shop => s !== null))
            } catch (err) {
                console.error('Failed to fetch history shops:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchShops()
    }, [historyIds])

    if (loading) {
        return (
            <div className="text-center py-4">
                <p className="text-text-muted">履歴を読み込み中...</p>
            </div>
        )
    }

    if (shops.length === 0) return null

    return (
        <section>
            <h2 className="text-lg font-medium text-text mb-4">最近見たお店</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {shops.map(shop => (
                    <Link key={shop.id} to={`/shop/${shop.id}`} state={{ from: 'history' }} className="shrink-0 w-48 bg-bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
                        <img src={shop.photo.pc.m} alt={shop.name} className="w-full h-32 object-cover" />
                        <div className="p-3">
                            <p className="text-sm font-medium text-text line-clamp-2">{shop.name}</p>
                            <p className="text-xs text-text-muted mt-1">{shop.genre.name}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
export default RecentlyViewed