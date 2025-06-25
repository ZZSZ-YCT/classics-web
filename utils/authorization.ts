import casdoor from '~/utils/casdoor'
import { jwtDecode } from 'jwt-decode'

export async function refreshToken() {
    const accessTokenCookie = useCookie('access_token')
    const refreshTokenCookie = useCookie('refresh_token')

    if(!refreshTokenCookie.value)
        return

    if(accessTokenCookie.value) {
        try {
            const exp = jwtDecode<{exp:number}>(accessTokenCookie.value).exp
            if(exp * 1000 > Date.now() + 60000) {
                return
            }
        } catch (_) {}
    }

    try {
        const resp = await casdoor.refreshAccessToken(refreshTokenCookie.value)
        accessTokenCookie.value = resp.access_token
        if(resp.refresh_token)
            refreshTokenCookie.value = resp.refresh_token
    } catch (e) {
        console.error(e)
        accessTokenCookie.value = null
        refreshTokenCookie.value = null
    }
}