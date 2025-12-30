package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kazu-1024/geogour/backend/internal/client"
	"github.com/kazu-1024/geogour/backend/internal/errors"
)

// 店舗関連のHTTPハンドラー
type ShopHandler struct {
	hotPepperClient *client.HotPepperClient
}

// ShopHandlerを生成
func NewShopHandler(hotPepperClient *client.HotPepperClient) *ShopHandler {
	return &ShopHandler{
		hotPepperClient: hotPepperClient,
	}
}

// 店舗検索
func (h *ShopHandler) Search(c *gin.Context) {
	// lat, lngのバリデーション
	if c.Query("lat") == "" || c.Query("lng") == "" {
		appErr := errors.NewValidation("lat, lng は必須パラメータです")
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}
	// クエリパラメータを取得
	lat, err := strconv.ParseFloat(c.Query("lat"), 64)
	if err != nil {
		appErr := errors.NewValidation("lat の形式が不正です")
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}
	lng, err := strconv.ParseFloat(c.Query("lng"), 64)
	if err != nil {
		appErr := errors.NewValidation("lng の形式が不正です")
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	rangeValue, _ := strconv.Atoi(c.DefaultQuery("range", "3"))
	start, _ := strconv.Atoi(c.DefaultQuery("start", "1"))
	count, _ := strconv.Atoi(c.DefaultQuery("count", "10"))
	genre := c.Query("genre")

	// 検索パラメータ
	params := client.SearchParams{
		Lat:   lat,
		Lng:   lng,
		Range: rangeValue,
		Genre: genre,
		Start: start,
		Count: count,
	}

	// HotPepper APIを呼び出す
	result, err := h.hotPepperClient.Search(params)
	if err != nil {
		// AppError の場合はそのまま返す
		if appErr, ok := err.(*errors.AppError); ok {
			c.JSON(appErr.HTTPStatus, appErr)
		} else {
			appErr := errors.NewInternalError(err.Error())
			c.JSON(appErr.HTTPStatus, appErr)
		}
		return
	}

	// 結果をJSONで返す
	c.JSON(http.StatusOK, result)

}

// 店舗詳細取得
func (h *ShopHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		appErr := errors.NewValidation("店舗IDは必須です")
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	// HotPepper APIを呼び出す（IDで検索）
	result, err := h.hotPepperClient.GetByID(id)
	if err != nil {
		if appErr, ok := err.(*errors.AppError); ok {
			c.JSON(appErr.HTTPStatus, appErr)
		} else {
			appErr := errors.NewInternalError(err.Error())
			c.JSON(appErr.HTTPStatus, appErr)
		}
		return
	}

	// 店舗が見つからない場合
	if len(result.Results.Shop) == 0 {
		appErr := errors.NewNotFound("店舗が見つかりませんでした")
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	// 最初の店舗を返す
	c.JSON(http.StatusOK, result.Results.Shop[0])
}
