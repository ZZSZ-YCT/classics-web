// https://nuxt.com/docs/api/configuration/nuxt-config
import { md3 } from 'vuetify/blueprints'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', '@pinia/nuxt'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
      htmlAttrs: {
        lang: 'zh-CN'
      },
    }
  },
  runtimeConfig: {
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,
    classicsJwt: process.env.CLASSICS_API_JWT,
    public: {
      apiUrl: 'https://classics-api.shittim.art/',
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY,
    },
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

  }
})