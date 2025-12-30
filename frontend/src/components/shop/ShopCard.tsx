import type { Shop } from '../../types/shop'

type ShopCardProps = {
    shop: Shop
    onClick: () => void
}

function ShopCard({ shop, onClick }: ShopCardProps) {
    return (
        <div onClick={onClick} role="button" tabIndex={0} className="bg-bg-card rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border border-border">
            <div className="flex gap-4 items-center">
                <img src={shop.photo.pc.m} alt={shop.name} className="w-32 h-20 md:w-40 md:h-28 lg:w-56 lg:h-36 object-cover rounded" />
                <div className="flex-1 min-w-0">
                    {/* ジャンル */}
                    <span className="text-xs text-text-muted">{shop.genre.name}</span>
                    {/* 店名 */}
                    <h3 className="font-bold text-xl mb-1 truncate text-text">{shop.name}</h3>
                    {/* アクセス */}
                    <div className="flex items-start gap-1 text-xs text-text-muted mb-1">
                        <span className="material-icons text-base shrink-0">train</span>
                        <span className="line-clamp-2">{shop.access}</span>
                    </div>
                    {/* 予算 */}
                    {shop.budget?.name && (
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                            <span className="material-icons text-base text-accent">payments</span>
                            <span>{shop.budget.name}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ShopCard