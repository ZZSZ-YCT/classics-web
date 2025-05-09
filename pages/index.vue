<script lang="ts" setup>
const articles = useArticleStore()
onMounted(async () => {
  await articles.fetch()
  for (let i = 0; i < articles.articles.length; i++) {
    active.value[i] = false
  }
  for (let i = 0; i < Math.min(articles.articles.length, 10); i++) {
    active.value[i] = true
  }
})
const active = ref([] as boolean[])
</script>
<template>
  <Link href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css" rel="stylesheet"/>
  <Link href="https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css" rel="stylesheet"/>
  <Title>ZZSZ Classics News</Title>
  <v-row class="fill-height" justify="center">
    <v-col v-for="(article, index) in articles.articles" cols="12" md="8">
      <v-lazy
          v-model="active[index]"
          :options="{'threshold':0.5}"
          class="fill-height"
          transition="fade-transition"
      >
        <v-skeleton-loader :loading="articles.loading" class="my-4 opacity-80 rounded-xl"
                           type="article">
          <article-card :article="article"/>
        </v-skeleton-loader>
      </v-lazy>
    </v-col>
  </v-row>
</template>

