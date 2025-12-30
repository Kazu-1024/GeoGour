package errors

import "net/http"

// エラーコード定数
const (
	CodeBadRequest     = "BAD_REQUEST"
	CodeNotFound       = "NOT_FOUND"
	CodeExternalAPI    = "EXTERNAL_API_ERROR"
	CodeInternalServer = "INTERNAL_SERVER_ERROR"
	CodeValidation     = "VALIDATION_ERROR"
	CodeTimeout        = "TIMEOUT"
)

// AppError アプリケーション共通エラー型
type AppError struct {
	Code       string `json:"code"`
	Message    string `json:"message"`
	Detail     string `json:"detail,omitempty"`
	HTTPStatus int    `json:"-"`
}

// Error error インターフェースを実装
func (e *AppError) Error() string {
	return e.Message
}

// NewBadRequest 400 Bad Request エラーを生成
func NewBadRequest(message, detail string) *AppError {
	return &AppError{
		Code:       CodeBadRequest,
		Message:    message,
		Detail:     detail,
		HTTPStatus: http.StatusBadRequest,
	}
}

// NewValidation バリデーションエラーを生成
func NewValidation(message string) *AppError {
	return &AppError{
		Code:       CodeValidation,
		Message:    message,
		HTTPStatus: http.StatusBadRequest,
	}
}

// NewNotFound 404 Not Found エラーを生成
func NewNotFound(message string) *AppError {
	return &AppError{
		Code:       CodeNotFound,
		Message:    message,
		HTTPStatus: http.StatusNotFound,
	}
}

// NewExternalAPIError 外部API呼び出しエラーを生成
func NewExternalAPIError(detail string) *AppError {
	return &AppError{
		Code:       CodeExternalAPI,
		Message:    "外部APIとの通信に失敗しました",
		Detail:     detail,
		HTTPStatus: http.StatusBadGateway,
	}
}

// NewInternalError 500 Internal Server Errorを生成
func NewInternalError(detail string) *AppError {
	return &AppError{
		Code:       CodeInternalServer,
		Message:    "サーバー内部エラーが発生しました",
		Detail:     detail,
		HTTPStatus: http.StatusInternalServerError,
	}
}

// NewTimeout タイムアウトエラーを生成
func NewTimeout(detail string) *AppError {
	return &AppError{
		Code:       CodeTimeout,
		Message:    "接続がタイムアウトしました",
		Detail:     detail,
		HTTPStatus: http.StatusGatewayTimeout,
	}
}
