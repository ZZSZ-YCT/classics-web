<script setup lang="ts">

import Pagination from "../../components/Pagination.vue";
import Container from "../../components/container/Container.vue";

const backgrounds = [
  "https://static.kivo.wiki/images/gallery/30/Tablet_AOS_01.jpg",
  "https://static.kivo.wiki/images/gallery/2.PV%E6%88%AA%E5%9B%BE-PV5%EF%BC%88%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%9C%8D%EF%BC%89-4K/%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%20%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%205th%20PV%20%287crM-RyP0jY%290187.png",
  "https://static.kivo.wiki/images/gallery/2.PV%E6%88%AA%E5%9B%BE-PV5%EF%BC%88%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%9C%8D%EF%BC%89-4K/%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%20%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%205th%20PV%20%287crM-RyP0jY%290587.png",
  "https://static.kivo.wiki/images/gallery/2.PV%E6%88%AA%E5%9B%BE-PV5%EF%BC%88%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%9C%8D%EF%BC%89-4K/%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%20%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%205th%20PV%20%287crM-RyP0jY%291057.png",
  "https://static.kivo.wiki/images/gallery/2.PV%E6%88%AA%E5%9B%BE-PV5%EF%BC%88%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%9C%8D%EF%BC%89-4K/%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%20%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%205th%20PV%20%287crM-RyP0jY%291287.png",
  "https://static.kivo.wiki/images/gallery/2.PV%E6%88%AA%E5%9B%BE-PV5%EF%BC%88%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%9C%8D%EF%BC%89-4K/%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%20%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%205th%20PV%20%287crM-RyP0jY%291525.png",
  "https://static.kivo.wiki/images/gallery/2.PV%E6%88%AA%E5%9B%BE-PV5%EF%BC%88%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%9C%8D%EF%BC%89-4K/%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%20%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%205th%20PV%20%287crM-RyP0jY%291525.png",
  "https://static.kivo.wiki/images/gallery/2.PV%E6%88%AA%E5%9B%BE-PV5%EF%BC%88%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%9C%8D%EF%BC%89-4K/%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%20%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%205th%20PV%20%287crM-RyP0jY%291701.png",
  "https://static.kivo.wiki/images/gallery/2.PV%E6%88%AA%E5%9B%BE-PV5%EF%BC%88%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%9C%8D%EF%BC%89-4K/%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%20%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%205th%20PV%20%287crM-RyP0jY%291920.png",
  "https://static.kivo.wiki/images/gallery/2.PV%E6%88%AA%E5%9B%BE-PV5%EF%BC%88%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%9C%8D%EF%BC%89-4K/%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%20%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%205th%20PV%20%287crM-RyP0jY%292098.png",
  "https://static.kivo.wiki/images/gallery/2.PV%E6%88%AA%E5%9B%BE-PV5%EF%BC%88%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%9C%8D%EF%BC%89-4K/%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%20%5B%E8%94%9A%E8%97%8D%E6%AA%94%E6%A1%88%5D%205th%20PV%20%287crM-RyP0jY%291936.png"
]

setInterval(async () => {
  const imageUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)]

  document.getElementById('body')!!.style.backgroundImage = `url(${imageUrl})`
}, 5000)

function login() {
  window.location.href = '/login'
}

</script>

<template>
  <header>
    <img src="https://static.shittim.art/images/blue-classics.png" alt="英才二班典籍" id="logo">
  </header>
  <button class="login-button" @click="login" type="button">
    登录
  </button>
  <Container/>
  <Pagination/>
</template>

<style scoped>
header {
  background: transparent;
  color: white;
  text-align: center;
  padding: 1em 0;
  font-size: 1.5em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background-color: #07f5ed;
  border: none;
  color: white;
  top: 12px;
  right: 24px;
  padding: 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #45a049;
}

#logo {
  height: 10vh;
  width: auto;
}
</style>
