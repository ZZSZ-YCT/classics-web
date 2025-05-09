// middleware/auth-protect.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useCasdoor }    from 'casdoor-vue-sdk'
import { useUserStore }  from '~/stores/userStore'

export default defineNuxtRouteMiddleware(() => {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
        const { getSigninUrl } = useCasdoor()
        return navigateTo(getSigninUrl())
    }
})
