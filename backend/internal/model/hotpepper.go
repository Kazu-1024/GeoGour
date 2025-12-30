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
	ID         string          `json:"id"`          // 店舗ID
	Name       string          `json:"name"`        // 店舗名
	Address    string          `json:"address"`     // 住所
	Lat        float64         `json:"lat"`         // 緯度
	Lng        float64         `json:"lng"`         // 経度
	Genre      HotPepperGenre  `json:"genre"`       // お店のジャンル
	SubGenre   HotPepperGenre  `json:"sub_genre"`   // お店のサブジャンル
	Budget     HotPepperBudget `json:"budget"`      // 予算
	BudgetMemo string          `json:"budget_memo"` // 料金備考 例：お通し代
	Catch      string          `json:"catch"`       // お店のキャッチ
	Access     string          `json:"access"`      // アクセス
	Urls       HotPepperUrls   `json:"urls"`        // HotPepperのお店詳細URL
	Photo      HotPepperPhoto  `json:"photo"`       // 写真
	Open       string          `json:"open"`        // 営業時間
	Close      string          `json:"close"`       // 定休日
	FreeDrink  string          `json:"free_drink"`  // 飲み放題
	FreeFood   string          `json:"free_food"`   // 食べ放題
	Card       string          `json:"card"`        // カード可
}

type HotPepperGenre struct {
	Code string `json:"code"`
	Name string `json:"name"`
}

type HotPepperBudget struct {
	Code    string `json:"code"`
	Name    string `json:"name"`
	Average string `json:"average"`
}

type HotPepperUrls struct {
	PC string `json:"pc"`
}

type HotPepperPhoto struct {
	PC HotPepperPhotoSize `json:"pc"`
}

type HotPepperPhotoSize struct {
	L string `json:"l"` // 店舗トップ写真(大）画像URL
	M string `json:"m"` // 店舗トップ写真(中）画像URL
	S string `json:"s"` // 店舗トップ写真(小）画像URL
}
