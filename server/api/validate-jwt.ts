// server/api/validate-jwt.ts
import { defineEventHandler, readBody, sendError } from 'h3'
import { verify } from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    // 从请求体或 Authorization header 中读取 access_token
    const body = await readBody<{ access_token?: string }>(event)
    let token = body.access_token
    if (!token) {
        const auth = event.node.req.headers.authorization || ''
        if (auth.startsWith('Bearer ')) {
            token = auth.slice(7)
        }
    }
    if (!token) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'No token provided' }))
    }

    try {
        // 从环境变量读取公钥
        const publicKey = process.env.CASDOOR_JWT_PUBLIC_KEY!
        // 校验并解码
        const payload = verify(token, publicKey, { algorithms: ['RS256'] })
        return { valid: true, payload }
    } catch (err: any) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Invalid token' }))
    }
})
