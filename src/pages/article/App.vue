<script setup lang="ts">

import Pagination from "../../components/Pagination.vue";
import Container from "../../components/container/Container.vue";
import axios from "axios";
import {onMounted, ref} from "vue";
import {getArticles, type idArticleLine} from "./request.ts";

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
  "https://static.shittim.art/images/4anniversary-pv/9.webp"]

setInterval(async () => {
  const imageUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)]

  const data = await axios.get(imageUrl, {
    responseType: 'blob'
  })

  const objectUrl = URL.createObjectURL(data.data)
  document.getElementById('body')!!.style.backgroundImage = `url(${objectUrl})`
}, 5000)

const currentPage = ref(1)
const onPageChange = (page: number) => {
  currentPage.value = page
}

function login() {
  window.location.href = 'login'
}

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

</script>

<template>
  <header>
    <img src="https://static.shittim.art/images/blue-classics.png" alt="英才二班典籍" id="logo">
    <div @click="login" class="login-button" aria-label="Login">
      Sign in
    </div>
  </header>
  <Container :page="currentPage" :articles="articles" :loading="loading"/>
  <Pagination :change-page="onPageChange" :current-page="currentPage" :article-num="articles.length" />
</template>

<style scoped>
header {
  background: transparent;
  color: white;
  text-align: center;
  padding: 1em 0;
  font-size: 1.5em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

footer {
  text-align: center;
  padding: 10px 0;
  background: transparent;
  color: white;
  margin-top: auto;
}

.login-button {
  position: absolute;
  color: #07f5ed;
  right: 8vh;
  text-align: right;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s, transform 0.2s;
}

.login-button:hover {
  color: #41cfc8;
  transform: scale(1.1);
}

.login-button:active {
  transform: scale(0.95);
}

#logo {
  height: 10vh;
  width: auto;
}

@media (max-width: 768px) {
  header {
    padding: 2em 0;
  }

  .login-button {
    font-size: 14px;
    margin-top: 1em;
  }

  #logo {
    height: 8vh;
  }
}
</style>
