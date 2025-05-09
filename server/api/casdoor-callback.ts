// server/api/casdoor-callback.ts
import { defineEventHandler, getQuery, createError, setCookie, sendRedirect, useRuntimeConfig } from 'h3'
import Sdk from 'casdoor-nodejs-sdk'  // 默认导出 Sdk :contentReference[oaicite:1]{index=1}

export default defineEventHandler(async event => {
    const { code } = getQuery(event)
    if (!code) {
        throw createError({ statusCode: 400, statusMessage: '缺少 code 参数' })
    }

    const runtime = useRuntimeConfig()
    const sdk = new Sdk({
        endpoint:     runtime.public.CASDOOR_SERVER_URL,
        clientId:     runtime.public.CASDOOR_CLIENT_ID,
        clientSecret: runtime.CASDOOR_CLIENT_SECRET,
        certificate:  runtime.CASDOOR_JWT_PUBLIC_KEY,
        orgName:      runtime.public.CASDOOR_ORG_NAME,
        appName:      runtime.public.CASDOOR_APP_NAME,
    })

    let tokenRes: { access_token: string; refresh_token: string }
    try {
        tokenRes = await sdk.getAuthToken(code as string)
    } catch (err: any) {
        throw createError({ statusCode: 502, statusMessage: `令牌交换失败：${err.message}` })
    }

    // 写 HTTP-only Cookie
    setCookie(event, 'access_token',  tokenRes.access_token,  { httpOnly: true, sameSite: 'lax' })
    setCookie(event, 'refresh_token', tokenRes.refresh_token, { httpOnly: true, sameSite: 'lax' })

    // 完成后 302 重定向回首页
    return sendRedirect(event, '/')
})
