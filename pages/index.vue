<script setup lang="ts">
const articles = useArticleStore()

await articles.fetch()
</script>

<template>
  <Link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css" />
  <Link rel="stylesheet" href="https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css" />
  <Title>ZZSZ Classics Web</Title>
  <div v-if="articles.loading">
    Loading..
  </div>
  <div v-else>
    <div v-for="article in articles.articles" :key="article.id">
      {{ article.line }}
    </div>
  </div>
</template>
