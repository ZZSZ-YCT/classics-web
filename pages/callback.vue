<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import casdoor, { certificate } from '~/utils/casdoor'
import { importSPKI, jwtVerify } from 'jose'
import { useUserStore } from '~/stores/UserStore'

const router = useRouter()
const user = useUserStore()

onMounted(async () => {
  try {
    const resp = await casdoor.exchangeForAccessToken()
    const accessCookie = useCookie('access_token')
    const refreshCookie = useCookie('refresh_token')
    accessCookie.value = resp.access_token
    refreshCookie.value = resp.refresh_token

    const key = await importSPKI(certificate, 'RS256')
    const { payload } = await jwtVerify(resp.access_token, key)
    user.username = (payload as any).name ?? (payload as any).username
    user.isLoggedIn = true
  } catch (e) {
    console.error(e)
  }
  router.replace('/')
})
</script>

<template>
  <v-container class="text-center py-10">
    <v-progress-circular indeterminate />
  </v-container>
</template>

<style scoped>
</style>
