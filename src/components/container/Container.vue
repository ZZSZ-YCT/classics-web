<script lang="ts">
import {defineComponent} from 'vue'
import Card from "./Card.vue";

export default defineComponent({
  name: "Container",
  components: {Card}
})
</script>

<template>
  <div class="container">
    <Card content="123" contrib="123" time="123" :sensitive=true :hidden=false :unsure=true />
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