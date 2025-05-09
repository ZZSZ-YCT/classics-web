// stores/userStore.ts
import { defineStore } from 'pinia'
import { useCookie }    from '#app'
import type { jwtPayload } from '~/types/Authorization'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        isLoggedIn:   false as boolean,
        username:     ''    as string,
        accessToken:  ''    as string,   // 新增
        refreshToken: ''    as string,   // 新增
    }),
    actions: {
        logout() {
            useCookie('access_token').value  = null
            useCookie('refresh_token').value = null
            this.isLoggedIn   = false
            this.username     = ''
            this.accessToken  = ''
            this.refreshToken = ''
        },
        /**
         * 接收并保存 token，顺便输出到控制台
         */
        setTokens(access: string, refresh: string) {
            console.debug('🔑 Access Token:', access)
            console.debug('🔄 Refresh Token:', refresh)
            // 写入 state
            this.accessToken  = access
            this.refreshToken = refresh
            // 并写入 Cookie
            useCookie('access_token').value  = access
            useCookie('refresh_token').value = refresh
        },
        async initialize() {
            this.isLoggedIn = false
            const access  = useCookie('access_token').value
            const refresh = useCookie('refresh_token').value

            if (refresh && !access) {
                try {
                    await $fetch('/api/refresh-token', { method: 'POST' })
                } catch {
                    this.logout()
                    return
                }
            }

            const token = useCookie('access_token').value
            if (!token) {
                this.logout()
                return
            }

            try {
                interface ValidateRes { valid: true; payload: jwtPayload }
                const res = await $fetch<ValidateRes>('/api/validate-jwt', {
                    method: 'POST',
                    body:   { access_token: token }
                })
                this.username   = res.payload.username
                this.isLoggedIn = true
                // 把 cookie 中的 token 同步到 state
                this.accessToken  = token
                this.refreshToken = useCookie('refresh_token').value || ''
            } catch {
                this.logout()
            }
        }
    }
})
