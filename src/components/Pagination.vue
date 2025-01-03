<script lang="ts">
import {computed, defineComponent} from 'vue'

export default defineComponent({
  name: "Pagination",
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    articleNum: {
      type: Number,
      required: true
    },
    changePage: {
      type: Function,
      required: true
    }
  },

  setup(props) {
    const pages = computed(() => {
      return Math.ceil(props.articleNum / 10)
    })

    const pageNums = computed(() => {
      let pageNums = []

      if (pages.value <= 11) {
        for (let i = 1; i <= pages.value; i++) {
          pageNums.push(i)
        }
      } else {
        let left = Math.min(props.currentPage - 1, 5)
        let right = Math.min(pages.value - props.currentPage, 10 - left)

        for (let i = props.currentPage - left; i <= props.currentPage + right; i++) {
          pageNums.push(i)
        }
      }

      return pageNums
    })

    return {
      pageNums,
      pages
    }
  }
})
</script>

<template>
  <div class="pagination">
    <a
        href="#"
        @click="changePage(Math.max(1, currentPage - 1))">
      Prev
    </a>
    <a
        href="#"
        :class="{'current': currentPage === i}"
        v-for="i in pageNums"
        :key="i"
        @click="changePage(i)">
      {{ i }}
    </a>
    <a
        href="#"
        @click="changePage(Math.min(currentPage + 1, pages))">
      Next
    </a>
  </div>
</template>

<style scoped>
.pagination {
  text-align: center;
  margin: 20px 0;
}

.pagination a {
  background-color: rgba(0, 255, 246, 0.2);
  text-decoration: none;
  color: #f9ff00;
  padding: 10px 15px;
  border: 1px solid #ddd;
  margin: 0 5px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.pagination a.current {
  font-weight: 1000;
}

.pagination a:hover {
  background-color: #007BFF;
  color: white;
}

</style>