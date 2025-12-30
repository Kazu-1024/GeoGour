// HotPepper APIの範囲マスタ
// @see https://webservice.recruit.co.jp/doc/hotpepper/reference.html #range
export const RANGES = [
    { value: 1, label: '300m' },
    { value: 2, label: '500m' },
    { value: 3, label: '1km' },
    { value: 4, label: '2km' },
    { value: 5, label: '3km' },
] as const

export type RangeValue = typeof RANGES[number]['value']