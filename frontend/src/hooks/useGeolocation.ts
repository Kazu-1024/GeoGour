import { useState, useCallback } from "react"

type Location = {
    lat: number
    lng: number
}

type GeolocationState = {
    location: Location | null
    loading: boolean
    error: string | null
}

export const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        location: null,
        loading: false,
        error: null
    })

    const getLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setState(prev => ({
                ...prev,
                error: '位置情報がサポートされていません'
            }))
            return
        }

        setState(prev => ({
            ...prev,
            loading: true,
            error: null
        }))

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    loading: false,
                    error: null,
                })
            },
            (error) => {
                console.error('Geolocation error:', error.message)
                setState({
                    location: null,
                    loading: false,
                    error: '位置情報を取得できませんでした',
                })
            }
        )
    }, [])
    return { ...state, getLocation }
}
