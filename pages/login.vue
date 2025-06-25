<script setup lang="ts">
import casdoor from '~/utils/casdoor'

function login() {
  casdoor.signin_redirect()
}
</script>

<template>
  <v-container class="text-center py-10">
    <v-btn color="primary" @click="login">使用 Casdoor 登录</v-btn>
  </v-container>
</template>

<style scoped>
</style>
