// https://nuxt.com/docs/api/configuration/nuxt-config
import { md3 } from 'vuetify/blueprints'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', '@pinia/nuxt'],
  css:['@/assets/css/main.css'],
  runtimeConfig: {
    // 私有
    CASDOOR_CLIENT_SECRET: process.env.CASDOOR_CLIENT_SECRET,
    CASDOOR_JWT_PUBLIC_KEY: process.env.CASDOOR_JWT_PUBLIC_KEY,
    BASE_URL:               process.env.BASE_URL,
    public: {
      CASDOOR_SERVER_URL:    process.env.NUXT_PUBLIC_CASDOOR_SERVER_URL,
      CASDOOR_CLIENT_ID:     process.env.NUXT_PUBLIC_CASDOOR_CLIENT_ID,
      CASDOOR_ORG_NAME:      process.env.NUXT_PUBLIC_CASDOOR_ORG_NAME,
      CASDOOR_APP_NAME:      process.env.NUXT_PUBLIC_CASDOOR_APP_NAME,
      CASDOOR_REDIRECT_PATH: process.env.NUXT_PUBLIC_CASDOOR_REDIRECT_PATH,
    }
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
      htmlAttrs: {
        lang: 'zh-CN'
      },
    }
  },
  vuetify: {
    vuetifyOptions: {
      blueprint: md3
    }
  },
  sourcemap: {
    client: true,
    server: true,
  },
  build: {
    transpile: ['jsonwebtoken']
  }
})