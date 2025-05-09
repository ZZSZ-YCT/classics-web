// server/api/refresh-token.ts
import { defineEventHandler, sendError, setCookie, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
    const refreshToken = getCookie(event, 'refresh_token')
    if (!refreshToken) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'No refresh token' }))
    }

    // 向 Casdoor 的 token 接口发起 refresh 请求
    const config = useRuntimeConfig()
    const tokenEndpoint = `${config.public.CASDOOR_SERVER_URL}/api/login/oauth/access_token`
    const resp = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            grant_type: 'refresh_token',
            client_id: config.public.CASDOOR_CLIENT_ID,
            client_secret: config.CASDOOR_CLIENT_SECRET,
            refresh_token: refreshToken,
        })
    })
    if (!resp.ok) {
        return sendError(event, createError({ statusCode: resp.status, statusMessage: 'Refresh failed' }))
    }
    const { access_token, refresh_token, expires_in } = await resp.json()

    // 写入 Cookie
    setCookie(event, 'access_token', access_token, {
        httpOnly: true, sameSite: 'lax', maxAge: expires_in
    })
    setCookie(event, 'refresh_token', refresh_token, {
        httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 3600  // 假设 Refresh Token 有 7 天有效期
    })

    return { access_token, refresh_token }
})
