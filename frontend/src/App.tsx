import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ShopDetailPage from './pages/ShopDetailPage'
import { SearchProvider } from './contexts/SearchContext'

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />           {/* 変更 */}
            <Route path="/search" element={<SearchPage />} />   {/* 追加 */}
            <Route path="/shop/:id" element={<ShopDetailPage />} />
          </Routes>
        </Layout>
      </SearchProvider>
    </BrowserRouter>
  )
}
export default App