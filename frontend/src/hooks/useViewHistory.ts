import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'geogour_view_history'
const MAX_HISTORY = 10
const MAX_AGE_DAYS = 30

type ViewHistoryItem = {
    id: string
    viewedAt: number
}

export function useViewHistory() {
    const [historyIds, setHistoryIds] = useState<ViewHistoryItem[]>([])

    // 初回ロード（期限切れを除外）
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                    const now = Date.now()
                    const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000
                    // 期限内のもののみ保持
                    const valid = parsed.filter(
                        (item: ViewHistoryItem) => now - item.viewedAt < maxAge
                    ).slice(0, MAX_HISTORY)

                    setHistoryIds(valid)
                    // クリーンアップしたデータを再保存
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(valid))
                }
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [])

    // 履歴に追加
    const addToHistory = useCallback((shopId: string) => {
        setHistoryIds(prev => {
            const filtered = prev.filter(item => item.id !== shopId)
            const updated = [
                { id: shopId, viewedAt: Date.now() },
                ...filtered
            ].slice(0, MAX_HISTORY)

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated
        })
    }, [])

    // 履歴クリア
    const clearHistory = useCallback(() => {
        setHistoryIds([])
        localStorage.removeItem(STORAGE_KEY)
    }, [])

    return { historyIds, addToHistory, clearHistory }
}