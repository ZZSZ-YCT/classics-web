// plugins/user-init.ts
import { defineNuxtPlugin } from '#app'
import { useUserStore }       from '~/stores/userStore'

export default defineNuxtPlugin(async () => {
    const userStore = useUserStore()
    await userStore.initialize()
})
