<template>
  <div class="h-screen flex items-center justify-center">
    <p class="text-lg">登录处理中，请稍候…</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

onMounted(async () => {
  if (!process.client) return

  try {
    // 后端接口会 setCookie + redirect('/')
    await fetch(`/api/casdoor-callback${window.location.search}`, {
      credentials: 'include'
    })
  } catch (e) {
    console.error('后端令牌交换失败', e)
  }
  // 兜底再去首页
  useRouter().replace('/')
})
</script>

<style scoped>
.h-screen { height:100vh; }
.flex     { display:flex; align-items:center; justify-content:center; }
.text-lg  { font-size:1.25rem; }
</style>
