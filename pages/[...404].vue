<script setup lang="ts">
</script>
<template>
  <div class="page-container">
    <div class="cover">
      <h1>404</h1>
      <p>Page Not Found</p>
    </div>
  </div>
</template>

<style scoped>
.cover {
  background-color: rgba(250, 250, 250, 0.8); /* 半透明浅色背景 */
  border-radius: 15px; /* 圆角 */
  padding: 2rem 3rem; /* 内边距 */
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 轻微阴影效果 */
}

.cover h1 {
  font-size: 12vw; /* 使用视口宽度来确保字体大小自适应 */
  font-weight: bold;
  color: #333;
  margin: 0;
}

.cover p {
  font-size: 3vw; /* 使用视口宽度来调整描述文本的大小 */
  color: #777;
  margin-top: 1rem;
}
</style>
