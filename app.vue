<!-- app.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const user = useUserStore()
const menuOpen = ref(false)

const backgrounds = [
  "https://static.shittim.art/images/4anniversary-pv/10.webp",
  "https://static.shittim.art/images/4anniversary-pv/11.webp",
  "https://static.shittim.art/images/4anniversary-pv/12.webp",
  "https://static.shittim.art/images/4anniversary-pv/13.webp",
  "https://static.shittim.art/images/4anniversary-pv/14.webp",
  "https://static.shittim.art/images/4anniversary-pv/15.webp",
  "https://static.shittim.art/images/4anniversary-pv/16.webp",
  "https://static.shittim.art/images/4anniversary-pv/17.webp",
  "https://static.shittim.art/images/4anniversary-pv/18.webp",
  "https://static.shittim.art/images/4anniversary-pv/19.webp",
  "https://static.shittim.art/images/4anniversary-pv/2.webp",
  "https://static.shittim.art/images/4anniversary-pv/20.webp",
  "https://static.shittim.art/images/4anniversary-pv/21.webp",
  "https://static.shittim.art/images/4anniversary-pv/22.webp",
  "https://static.shittim.art/images/4anniversary-pv/23.webp",
  "https://static.shittim.art/images/4anniversary-pv/24.webp",
  "https://static.shittim.art/images/4anniversary-pv/25.webp",
  "https://static.shittim.art/images/4anniversary-pv/26.webp",
  "https://static.shittim.art/images/4anniversary-pv/27.webp",
  "https://static.shittim.art/images/4anniversary-pv/28.webp",
  "https://static.shittim.art/images/4anniversary-pv/29.webp",
  "https://static.shittim.art/images/4anniversary-pv/3.webp",
  "https://static.shittim.art/images/4anniversary-pv/30.webp",
  "https://static.shittim.art/images/4anniversary-pv/31.webp",
  "https://static.shittim.art/images/4anniversary-pv/32.webp",
  "https://static.shittim.art/images/4anniversary-pv/34.webp",
  "https://static.shittim.art/images/4anniversary-pv/35.webp",
  "https://static.shittim.art/images/4anniversary-pv/36.webp",
  "https://static.shittim.art/images/4anniversary-pv/37.webp",
  "https://static.shittim.art/images/4anniversary-pv/38.webp",
  "https://static.shittim.art/images/4anniversary-pv/39.webp",
  "https://static.shittim.art/images/4anniversary-pv/4.webp",
  "https://static.shittim.art/images/4anniversary-pv/40.webp",
  "https://static.shittim.art/images/4anniversary-pv/41.webp",
  "https://static.shittim.art/images/4anniversary-pv/42.webp",
  "https://static.shittim.art/images/4anniversary-pv/43.webp",
  "https://static.shittim.art/images/4anniversary-pv/44.webp",
  "https://static.shittim.art/images/4anniversary-pv/45.webp",
  "https://static.shittim.art/images/4anniversary-pv/46.webp",
  "https://static.shittim.art/images/4anniversary-pv/47.webp",
  "https://static.shittim.art/images/4anniversary-pv/49.webp",
  "https://static.shittim.art/images/4anniversary-pv/5.webp",
  "https://static.shittim.art/images/4anniversary-pv/50.webp",
  "https://static.shittim.art/images/4anniversary-pv/51.webp",
  "https://static.shittim.art/images/4anniversary-pv/53.webp",
  "https://static.shittim.art/images/4anniversary-pv/54.webp",
  "https://static.shittim.art/images/4anniversary-pv/55.webp",
  "https://static.shittim.art/images/4anniversary-pv/56.webp",
  "https://static.shittim.art/images/4anniversary-pv/57.webp",
  "https://static.shittim.art/images/4anniversary-pv/58.webp",
  "https://static.shittim.art/images/4anniversary-pv/59.webp",
  "https://static.shittim.art/images/4anniversary-pv/6.webp",
  "https://static.shittim.art/images/4anniversary-pv/60.webp",
  "https://static.shittim.art/images/4anniversary-pv/61.webp",
  "https://static.shittim.art/images/4anniversary-pv/62.webp",
  "https://static.shittim.art/images/4anniversary-pv/63.webp",
  "https://static.shittim.art/images/4anniversary-pv/64.webp",
  "https://static.shittim.art/images/4anniversary-pv/65.webp",
  "https://static.shittim.art/images/4anniversary-pv/66.webp",
  "https://static.shittim.art/images/4anniversary-pv/7.webp",
  "https://static.shittim.art/images/4anniversary-pv/8.webp",
  "https://static.shittim.art/images/4anniversary-pv/9.webp"
]

onMounted(async () => {
  // 初始化用户状态
  await user.initialize()

  // 每 5s 切换背景
  setInterval(async () => {
    const imageUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)]
    try {
      const data = await $fetch<Blob>(imageUrl, {
        method: 'GET',
        responseType: 'blob'
      })
      if (data) {
        const objectUrl = URL.createObjectURL(data)
        document.getElementById('page-body')!.style.backgroundImage = `url(${objectUrl})`
      }
    } catch (err) {
      console.error(err)
    }
  }, 5000)
})
</script>

<template>
  <!-- 全局样式依赖 -->
  <Link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css" />
  <Link rel="stylesheet" href="https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css" />

  <!-- HTML 标题 -->
  <Title>ZZSZ Classics News</Title>

  <v-app id="page-body">
    <!-- 顶部导航栏 -->
    <v-app-bar :elevation="2" rounded>
      <v-app-bar-title>ZZSZ-YCT 典籍新闻</v-app-bar-title>

      <template v-slot:append>
        <template v-if="user.isLoggedIn">
          <v-menu v-model="menuOpen" :close-on-content-click="false" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn prepend-icon="mdi-account" v-bind="props">
                {{ user.username }}
              </v-btn>
            </template>
            <v-card min-width="300">
              <v-list>
                <v-list-item prepend-icon="mdi-emoticon-kiss-outline" :title="user.username">
                  <template v-slot:append>
                    <v-tooltip text="Not developed">
                      <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-cog" v-bind="props" variant="plain"></v-btn>
                      </template>
                    </v-tooltip>
                  </template>
                </v-list-item>
              </v-list>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" variant="text" @click="menuOpen = false; user.logout()">
                  Sign out
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </template>

        <template v-else>
          <nuxt-link to="/login" class="text-black">
            <v-btn prepend-icon="mdi-account">Sign in</v-btn>
          </nuxt-link>
        </template>
      </template>
    </v-app-bar>

    <!-- 各页面内容插槽 -->
    <NuxtPage></NuxtPage>
    <slot />
  </v-app>
</template>

<style scoped>
#page-body {
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("https://static.shittim.art/images/tablet-aos-01.webp");
  transition: background 0.7s ease;
}
</style>
