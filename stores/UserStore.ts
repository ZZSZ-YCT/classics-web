import type {jwtPayload} from "~/types/Authorization";
import {jwtDecode} from "jwt-decode";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        isLoggedIn: true,
        username: "username"
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
                this.username = jwtDecode<jwtPayload>(refreshTokenCookie.value).username
                this.isLoggedIn = true
                if(!accessTokenCookie.value) {
                    refreshToken()
                }
            }
        }
    }
})