// エラーコード（バックエンドと一致）
export const ErrorCode = {
    BAD_REQUEST: 'BAD_REQUEST',
    NOT_FOUND: 'NOT_FOUND',
    EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    TIMEOUT: 'TIMEOUT',
    NETWORK_ERROR: 'NETWORK_ERROR',         // フロントエンド専用
    GEOLOCATION_ERROR: 'GEOLOCATION_ERROR', // フロントエンド専用
} as const

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode]

// APIエラーレスポンス型
export type ApiError = {
    code: ErrorCodeType
    message: string
    detail?: string
}

// ユーザー向けメッセージマッピング
export const userFriendlyMessages: Record<ErrorCodeType, string> = {
    BAD_REQUEST: '入力内容に問題があります',
    NOT_FOUND: 'データが見つかりませんでした',
    EXTERNAL_API_ERROR: '外部サービスとの通信に失敗しました。しばらく待ってから再試行してください',
    INTERNAL_SERVER_ERROR: 'サーバーエラーが発生しました。しばらく待ってから再試行してください',
    VALIDATION_ERROR: '入力内容を確認してください',
    TIMEOUT: '通信がタイムアウトしました。ネットワーク環境を確認してください',
    NETWORK_ERROR: 'ネットワーク接続を確認してください',
    GEOLOCATION_ERROR: '位置情報を取得できませんでした。ブラウザの設定を確認してください',
}

// 再試行可能なエラーかどうかを判定
export const isRetryableError = (code: ErrorCodeType): boolean => {
    const retryableCodes: ErrorCodeType[] = [
        ErrorCode.EXTERNAL_API_ERROR,
        ErrorCode.TIMEOUT,
        ErrorCode.NETWORK_ERROR,
    ]
    return retryableCodes.includes(code)
}
