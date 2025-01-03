<script lang="ts">
import {computed, defineComponent} from 'vue'
import Card from "./Card.vue";
import {type idArticleLine} from "../../pages/article/request.ts";

export default defineComponent({
  name: "Container",
  components: {Card},
  props: {
    articles: {
      type: Array as () => idArticleLine[],
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    }
  },
  setup(props) {
    //const articles = ref<idArticleLine[]>([])
    //const loading = ref<boolean>(true)

    const paginatedArticles = computed(() => {
      const startPage = (props.page - 1) * 10
      const endPage = startPage + 10
      return props.articles.slice(startPage, endPage)
    })

    return {
      paginatedArticles,
    }
  },
})
</script>

<template>
  <div class="container">
    <div v-if="loading">Fetching Articles...</div>
    <div v-else>
      <Card
          v-for="article in paginatedArticles"
          :key="article.id"
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