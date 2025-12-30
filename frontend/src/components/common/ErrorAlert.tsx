import { type ApiError, userFriendlyMessages, isRetryableError, ErrorCode } from '../../types/error'

type Props = {
    error: ApiError | null
    onRetry?: () => void
}

function ErrorAlert({ error, onRetry }: Props) {
    if (!error) return null

    const isRetryable = isRetryableError(error.code)

    // エラーの種類に応じた色を設定
    const getColorClasses = () => {
        switch (error.code) {
            case ErrorCode.NOT_FOUND:
                return 'bg-yellow-50 border-yellow-400 text-yellow-800'
            case ErrorCode.VALIDATION_ERROR:
            case ErrorCode.BAD_REQUEST:
                return 'bg-orange-50 border-orange-400 text-orange-800'
            default:
                return 'bg-red-50 border-red-400 text-red-800'
        }
    }

    // アイコンを取得
    const getIcon = () => {
        switch (error.code) {
            case ErrorCode.NOT_FOUND:
                return 'search_off'
            case ErrorCode.TIMEOUT:
            case ErrorCode.NETWORK_ERROR:
                return 'wifi_off'
            case ErrorCode.GEOLOCATION_ERROR:
                return 'location_off'
            default:
                return 'error_outline'
        }
    }

    return (
        <div className={`${getColorClasses()} border-l-4 p-4 rounded-lg mb-4`}>
            <div className="flex items-start">
                <span className="material-icons mr-3 mt-0.5">{getIcon()}</span>
                <div className="flex-1">
                    <p className="font-medium">
                        {userFriendlyMessages[error.code]}
                    </p>
                    {error.detail && (
                        <p className="text-sm mt-1 opacity-80">
                            {error.detail}
                        </p>
                    )}
                    {isRetryable && onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-current hover:bg-gray-50 transition-colors"
                        >
                            <span className="material-icons text-base mr-1">refresh</span>
                            再試行する
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ErrorAlert
