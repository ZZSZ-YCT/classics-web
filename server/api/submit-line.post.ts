/* server/api/submit-line.post.ts ----------------------------------------- */
import { $fetch } from 'ofetch';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const {
        cfToken,
        line,
        contrib,
        time,
        unsure = false,
        sensitive = false,
    } = body || {};

    if (!cfToken || !line || !contrib || !time) {
        throw createError({ statusCode: 400, statusMessage: '参数不完整' });
    }

    /* ---------- 运行时配置（来自 .env） ---------- */
    const {
        turnstileSecretKey,
        classicsJwt,
    } = useRuntimeConfig(event);

    /* ---------- 1) 校验 Turnstile ---------- */
    const verifyRes: {
        success: boolean;
        'error-codes'?: string[];
    } = await $fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: new URLSearchParams({
            secret: turnstileSecretKey,
            response: cfToken,
            // remoteip 可选：event.node.req.headers['x-forwarded-for'] || ''
        }),
    });

    if (!verifyRes.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Turnstile 校验失败',
            data: verifyRes['error-codes'],
        });
    }

    /* ---------- 2) 调用外部 classics-api ---------- */
    const upstream = await $fetch.raw('https://classics-api.shittim.art/line/append', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${classicsJwt}`,
        },
        body: JSON.stringify({
            line,
            contrib,
            time,
            unsure,
            sensitive,
            hidden: false,
        }),
    });

    if (upstream.status === 201) {
        return { ok: true };
    }

    /* 若上游非 201，则转发其状态码与文本 */
    throw createError({
        statusCode: upstream.status,
        statusMessage: upstream.statusText || '上游接口错误',
    });
});
