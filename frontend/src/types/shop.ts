export type Shop = {
    id: string
    name: string
    address: string
    lat: number
    lng: number
    genre: {
        code: string
        name: string
    }
    sub_genre: {
        code: string
        name: string
    }
    budget: {
        code: string
        name: string
        average: string
    }
    budget_memo: string
    catch: string
    access: string
    urls: {
        pc: string
    }
    photo: {
        pc: {
            l: string
            m: string
            s: string
        }
    }
    open: string
    close: string
    free_drink: string
    free_food: string
    card: string
}

export type ShopSearchResult = {
    results: {
        results_available: number
        results_returned: string
        results_start: number
        shop: Shop[]
    }
}