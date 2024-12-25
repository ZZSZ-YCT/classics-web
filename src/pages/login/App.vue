<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "App.vue",
  setup: function () {
    function test() {
      window.alert("b")
    }

    return { test }
  }
})
</script>

<template>
  <h1>Test multi page</h1>
  <button @click="test()">Click</button>
</template>

<style scoped>
</style>