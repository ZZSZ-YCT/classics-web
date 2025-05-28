<!-- pages/index.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const articles = useArticleStore()
const active = ref<boolean[]>([])
/*await articles.fetch()*/
onMounted(async () => {
  // 拉取文章列表
  // 前 10 条默认激活展示，其余延迟加载
  active.value = articles.articles.map((_, i) => i < 10)
})
</script>

<template>
  <v-container>
    <v-main>
      <v-row justify="center" class="fill-height">
        <v-col
            v-for="(article, index) in articles.articles"
            :key="article.id"
            cols="12"
            md="8"
        >
          <v-lazy
              v-model="active[index]"
              :options="{ threshold: 0.5 }"
              transition="fade-transition"
              class="fill-height"
          >
            <v-skeleton-loader
                type="article"
                :loading="articles.loading"
                class="my-4 opacity-80 rounded-xl"
            >
              <article-card :article="article"/>
            </v-skeleton-loader>
          </v-lazy>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>
