function ScrollToTop() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-40"
            aria-label="ページトップへ戻る"
        >
            <span className="material-icons text-gray-600">keyboard_arrow_up</span>
        </button>
    )
}

export default ScrollToTop
