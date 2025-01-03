<script lang="ts">
import {defineComponent, ref} from 'vue'
import axios from "axios";
import {hitokoto} from "../constants.ts";
import {loginToServer} from "./authorization.ts";
import {useCookies} from "@vueuse/integrations/useCookies";

const tarots = [
  '0.png',
  '1.png',
  '10.png',
  '11.png',
  '12.png',
  '13.png',
  '14.png',
  '15.png',
  '16.png',
  '17.png',
  '18.png',
  '19.png',
  '2.png',
  '20.png',
  '21.png',
  '3.png',
  '4.png',
  '5.png',
  '6.png',
  '7.png',
  '8.png',
  '9.png']

const cookies = useCookies(['classics'])

export default defineComponent({
  name: "App.vue",
  setup() {
    const username = ref<string>('')
    const password = ref<string>('')
    const error = ref<string>('')

    const handleLogin = async () => {
      if (username.value.length && password.value.length) {
        const token = await loginToServer(
            {
              username: username.value,
              password: password.value,
            }
        )

        if (token) {
          cookies.set('access_token', token.accessToken, {expires: new Date(Date.now() + 15 * 60 * 1000)})
          cookies.set('refresh_token', token.refreshToken, {expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
          window.location.href = document.referrer
        } else {
          error.value = "Failed to login, please check your credentials and try again"
        }
      } else {
        error.value = "Please input your username and password"
      }
    }

    axios.get(hitokoto).then((res) => {
      document.getElementById('hitokoto-content')!!.innerText = res.data['hitokoto']
      document.getElementById('hitokoto-source')!!.innerText = res.data['from']
    })

    setInterval(async () => {
      const imageUrl = tarots[Math.floor(Math.random() * tarots.length)]

      const data = await axios.get(`https://static.shittim.art/images/shi0n-tarots/${imageUrl}`, {
        responseType: 'blob',
      })

      const objectUrl = URL.createObjectURL(data.data)
      document.getElementById('tarot-image')!!.style.backgroundImage = `url(${objectUrl})`
      /*document.getElementById('tarot-image')!!.style.backgroundImage =
          `url(https://static.shittim.art/images/shi0n-tarots/${imageUrl})`*/
    }, 5000)

    return {
      username,
      password,
      error,
      handleLogin,
    }
  },
})
</script>

<template>
  <div class="flex h-screen bg-gray-200">
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
          <div class="mb-4 mt-4 text-red-500" v-if="error">
            {{ error }}
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

    <div class="hidden lg:flex w-1/2 items-center justify-center bg-white">
      <div id="tarot-image">

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

#tarot-image {
  background-image: url("https://static.shittim.art/images/shi0n-tarots/17.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 75vh;
  height: 75vh;
}
</style>