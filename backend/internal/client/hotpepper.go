package client

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/kazu-1024/geogour/backend/internal/errors"
	"github.com/kazu-1024/geogour/backend/internal/model"
)

// HotPepperClient APIを呼び出すクライアント
type HotPepperClient struct {
	apiKey  string
	client  *http.Client
	baseURL string
}

// HotPepperClientを生成
func NewHotPepperClient(apiKey string) *HotPepperClient {
	return &HotPepperClient{
		apiKey: apiKey,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
		baseURL: "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/",
	}
}

// 検索パラメーター
type SearchParams struct {
	Lat   float64
	Lng   float64
	Range int
	Genre string
	Start int
	Count int
}

// 値が空でない場合のみクエリパラメータをセット
func setIfNotEmpty(q url.Values, key, value string) {
	if value != "" {
		q.Set(key, value)
	}
}

// 指定した条件で店舗を検索
func (c *HotPepperClient) Search(params SearchParams) (*model.HotPepperResponse, error) {
	u, err := url.Parse(c.baseURL)
	if err != nil {
		return nil, fmt.Errorf("url parse error: %w", err)
	}
	q := u.Query()
	q.Set("key", c.apiKey)
	q.Set("lat", fmt.Sprintf("%f", params.Lat))
	q.Set("lng", fmt.Sprintf("%f", params.Lng))
	q.Set("range", fmt.Sprintf("%d", params.Range))
	q.Set("start", fmt.Sprintf("%d", params.Start))
	q.Set("count", fmt.Sprintf("%d", params.Count))
	q.Set("format", "json")

	setIfNotEmpty(q, "genre", params.Genre)

	u.RawQuery = q.Encode()

	resp, err := c.client.Get(u.String())
	if err != nil {
		// タイムアウト判定
		if strings.Contains(err.Error(), "timeout") || strings.Contains(err.Error(), "deadline") {
			return nil, errors.NewTimeout("HotPepper APIへの接続がタイムアウトしました")
		}
		return nil, errors.NewExternalAPIError(err.Error())
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.NewExternalAPIError(fmt.Sprintf("HotPepper API returned status %d", resp.StatusCode))
	}

	var result model.HotPepperResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, errors.NewExternalAPIError("レスポンスの解析に失敗しました")
	}

	return &result, nil
}

// IDで店舗を取得
func (c *HotPepperClient) GetByID(id string) (*model.HotPepperResponse, error) {
	u, err := url.Parse(c.baseURL)
	if err != nil {
		return nil, errors.NewInternalError("URL解析エラー")
	}
	q := u.Query()
	q.Set("key", c.apiKey)
	q.Set("id", id)
	q.Set("format", "json")

	u.RawQuery = q.Encode()

	resp, err := c.client.Get(u.String())
	if err != nil {
		if strings.Contains(err.Error(), "timeout") || strings.Contains(err.Error(), "deadline") {
			return nil, errors.NewTimeout("HotPepper APIへの接続がタイムアウトしました")
		}
		return nil, errors.NewExternalAPIError(err.Error())
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.NewExternalAPIError(fmt.Sprintf("HotPepper API returned status %d", resp.StatusCode))
	}

	var result model.HotPepperResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, errors.NewExternalAPIError("レスポンスの解析に失敗しました")
	}

	return &result, nil
}
