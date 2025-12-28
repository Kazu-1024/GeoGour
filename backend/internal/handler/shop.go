package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kazu-1024/geogour/backend/internal/client"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "location coordinates are required"})
		return
	}
	// クエリパラメータを取得
	lat, err := strconv.ParseFloat(c.Query("lat"), 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid latitude format"})
		return
	}
	lng, err := strconv.ParseFloat(c.Query("lng"), 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid longitude format"})
		return
	}
	rangeValue, _ := strconv.Atoi(c.DefaultQuery("range", "3"))
	start, _ := strconv.Atoi(c.DefaultQuery("start", "1"))
	count, _ := strconv.Atoi(c.DefaultQuery("count", "10"))

	// 検索パラメータ
	params := client.SearchParams{
		Lat:   lat,
		Lng:   lng,
		Range: rangeValue,
		Start: start,
		Count: count,
	}

	// HotPepper APIを呼び出す
	result, err := h.hotPepperClient.Search(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 結果をJSONで返す
	c.JSON(http.StatusOK, result)

}
