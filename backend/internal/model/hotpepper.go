package model

type HotPepperResponse struct {
	Results HotPepperResults `json:"results"`
}

type HotPepperResults struct {
	ResultsAvailable int             `json:"results_available"`
	ResultsReturned  string          `json:"results_returned"`
	ResultsStart     int             `json:"results_start"`
	Shop             []HotPepperShop `json:"shop"`
}

type HotPepperShop struct {
	ID      string         `json:"id"`      // 店舗ID
	Name    string         `json:"name"`    // 店舗名
	Address string         `json:"address"` // 住所
	Access  string         `json:"access"`  // アクセス
	Photo   HotPepperPhoto `json:"photo"`   // 写真
	Open    string         `json:"open"`    // 営業時間
	Close   string         `json:"close"`   // 定休日
}

type HotPepperPhoto struct {
	PC HotPepperPhotoSize `json:"pc"`
}

type HotPepperPhotoSize struct {
	L string `json:"l"` // 店舗トップ写真(大）画像URL
	M string `json:"m"` // 店舗トップ写真(中）画像URL
	S string `json:"s"` // 店舗トップ写真(小）画像URL
}
