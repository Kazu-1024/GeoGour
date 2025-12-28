package client

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

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
	Start int
	Count int
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
	u.RawQuery = q.Encode()

	resp, err := c.client.Get(u.String())
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("status code: %d", resp.StatusCode)
	}

	var result model.HotPepperResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}
