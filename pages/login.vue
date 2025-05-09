<template>
  <div class="h-screen flex items-center justify-center">
    <p class="text-lg">跳转到 Casdoor 登录中…</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNuxtApp, useCookie } from '#app'

onMounted(() => {
  if (!process.client) return

  if (useCookie('access_token').value) {
    // 已登录则回首页
    window.location.href = '/'
    return
  }

  // 发起登录跳转
  const sdk = useNuxtApp().$casdoorSdk as InstanceType<typeof import('casdoor-js-sdk').default>
  window.location.href = sdk.getSigninUrl()
})
</script>

<style scoped>
.h-screen { height:100vh; }
.flex     { display:flex; align-items:center; justify-content:center; }
.text-lg  { font-size:1.25rem; }
</style>
