// plugins/casdoor.client.ts
import { defineNuxtPlugin } from '#app'
import Sdk from 'casdoor-js-sdk'  // 默认导出 Sdk :contentReference[oaicite:0]{index=0}

export default defineNuxtPlugin(nuxtApp => {
    const cfg = nuxtApp.$config.public as Record<string, string>
    const sdk = new Sdk({
        serverUrl:        cfg.CASDOOR_SERVER_URL,
        clientId:         cfg.CASDOOR_CLIENT_ID,
        appName:          cfg.CASDOOR_APP_NAME,
        organizationName: cfg.CASDOOR_ORG_NAME,
        redirectPath:     cfg.CASDOOR_REDIRECT_PATH,  // 一定要有 "/callback"
        // signinPath: "/api/signin"  // 如果你用自定义后端接口，可打开此项
    })
    nuxtApp.provide('casdoorSdk', sdk)
})
