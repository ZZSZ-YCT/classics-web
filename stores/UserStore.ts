import type {jwtPayload} from "~/types/Authorization";
import {jwtDecode} from "jwt-decode";
import {refreshToken} from "~/utils/authorization";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        isLoggedIn: false,
        username: ''
    }),
    actions: {
        logout() {
            const accessTokenCookie = useCookie('access_token')
            const refreshTokenCookie = useCookie('refresh_token')

            accessTokenCookie.value = null
            refreshTokenCookie.value = null
        },
        async initialize() {
            const accessTokenCookie = useCookie('access_token')
            const refreshTokenCookie = useCookie('refresh_token')

            this.isLoggedIn = false
            if(accessTokenCookie.value && !refreshTokenCookie.value) {
                this.logout()
                return
            }

            if(refreshTokenCookie.value) {
                const payload = jwtDecode<jwtPayload>(refreshTokenCookie.value)
                this.username = payload.name ?? payload.username
                this.isLoggedIn = true
                await refreshToken()
            }
        }
    }
})