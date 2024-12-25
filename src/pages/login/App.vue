<script lang="ts">
import {defineComponent, ref} from 'vue'
import axios from "axios";
import {hitokoto} from "../constants.ts";

export default defineComponent({
  name: "App.vue",
  setup() {
    const username = ref<string>('')
    const password = ref<string>('')
    const error = ref<string>('')
    const token = ref<string>('')

    const handleLogin = async () => {
      if (!token.value.length) {
        error.value = "请完成Captcha"
        return
      }
      if (username.value.length && password.value.length) {

      } else {
        error.value = "请输入用户名和密码"
      }
    }

    const onTurnstile = (g_token: string) => {
      token.value = g_token
    }

    axios.get(hitokoto).then((res) => {
      document.getElementById('hitokoto-content')!!.innerText = res.data['hitokoto']
      document.getElementById('hitokoto-source')!!.innerText = res.data['from']
    })

    return {
      username,
      password,
      error,
      token,
      handleLogin,
      onTurnstile,
    }
  },
})
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- 左侧登录表单 -->
    <div class="w-full max-w-md mx-auto flex flex-col justify-center">
      <div class="bg-white shadow-lg rounded-lg p-8">
        <h1 class="text-2xl font-bold mb-4">Welcome Back 👋</h1>
        <div class="text-gray-600 mb-6">
          <p id="hitokoto-content" class="mt-3"></p>
          <p id="hitokoto-source" style="text-align: right" class="mt-4"></p>
        </div>
        <form @submit.prevent="handleLogin()">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Username</label>
            <input
                type="text"
                id="email"
                v-model="username"
                class="mt-2 pl-3 block w-full rounded-xl bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-8"
                placeholder="John"
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
                type="password"
                id="password"
                v-model="password"
                class="mt-2 pl-3 block w-full rounded-xl bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-8"
                placeholder="At least 8 characters"
            />
          </div>
          <button
              type="submit"
              class="w-full bg-indigo-600 text-white py-2 px-4 hover:bg-indigo-700 transition rounded-xl"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>

    <div class="hidden lg:flex w-1/2 items-center justify-center bg-gray-200">
      <div class="w-3/4 h-3/4 bg-gray-400 rounded-md">
        <!-- 用于显示占位符，稍后可以替换为实际图片 -->
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Damion&family=Merienda:wght@300..900&display=swap');

* {
  font-family: "Merienda", serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}
</style>