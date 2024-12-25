<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import Card from "./Card.vue";
import {getArticles, type idArticleLine} from "../../pages/article/request.ts";

export default defineComponent({
  name: "Container",
  components: {Card},
  setup() {
    const articles = ref<idArticleLine[]>([])
    const loading = ref<boolean>(true)

    const fetchArticles = async () => {
      const data = await getArticles()

      if (data) {
        articles.value = data
      }
      loading.value = false
    }

    onMounted(() => {
      fetchArticles()
    })

    return {
      articles,
      loading,
    }
  },
})
</script>

<template>
  <div class="container">
    <div v-if="loading">Fetching Articles...</div>
    <div v-else>
      <Card
          v-for="article in articles"
          :content="article.line"
          :contrib="article.contrib"
          :time="article.time"
          :sensitive="article.sensitive"
          :unsure="article.unsure"
          :hidden="article.hidden"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  min-width: 300px;
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

@media (max-width: 600px) {
  .container {
    width: 90%;
  }
}
</style>