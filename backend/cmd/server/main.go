package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kazu-1024/geogour/backend/internal/client"
	"github.com/kazu-1024/geogour/backend/internal/config"
	"github.com/kazu-1024/geogour/backend/internal/handler"
)

func main() {
	// 設定を読み込む
	cfg := config.Load()

	// HotPepperClientを生成
	hotPepperClient := client.NewHotPepperClient(cfg.HotPepperAPIKey)

	// ShopHandlerを生成
	shopHandler := handler.NewShopHandler(hotPepperClient)

	r := gin.Default()

	// healthcheck
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// 店舗検索API
	r.GET("/api/shops", shopHandler.Search)

	// 店舗詳細API
	r.GET("/api/shops/:id", shopHandler.GetByID)

	// サーバー起動
	r.Run(":" + cfg.Port)

}
