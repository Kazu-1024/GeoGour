import Header from './Header'
import Footer from './Footer'
import ScrollToTop from '../common/ScrollToTop'

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-bg">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    )
}
export default Layout