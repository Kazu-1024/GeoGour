import { Link, useLocation } from 'react-router-dom'
import logo from "../../assets/Geogour_logo.png"
function Header() {
    const location = useLocation()
    const isHome = location.pathname === '/'
    return (
        <header className="bg-bg-card border-b border-border py-3 px-4 shadow-sm z-10">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                {/* ホーム以外でロゴ表示 */}
                {!isHome && (
                    <div>
                        <Link to="/">
                            <img src={logo} alt="GeoGour Logo" className="h-8 cursor-pointer" />
                        </Link>
                        <p className="text-xs text-text-muted">現在地から近い飲食店を検索</p>
                    </div>
                )}
                {/* ナビゲーションアイコン */}
                <nav className={`flex gap-4 ${isHome ? 'ml-auto' : ''}`}>
                    <button className="flex flex-col items-center text-text-muted hover:text-primary">
                        <span className="material-icons text-2xl">favorite</span>
                        <span className="text-xs">お気に入り</span>
                    </button>
                    <button className="flex flex-col items-center text-text-muted hover:text-primary">
                        <span className="material-icons text-2xl">person</span>
                        <span className="text-xs">マイページ</span>
                    </button>
                </nav>
            </div>
        </header>
    )
}
export default Header