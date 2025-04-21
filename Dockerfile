# ----------------------------
# Stage 1: Install & Build (using Node.js)
# ----------------------------
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    # 拷贝 package 文件并安装依赖
    COPY package*.json ./
    RUN npm ci
    
    # 拷贝源码并执行构建
    COPY . .
    RUN npm run build
    
    # ----------------------------
    # Stage 2: Runtime (using Bun)
    # ----------------------------
    FROM oven/bun:latest AS runner
    WORKDIR /app
    
    # 拷贝构建产物和依赖
    COPY --from=builder /app/.output ./.output
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package*.json ./
    
    # ENV 让 Nuxt 监听 0.0.0.0:3000
    ENV NUXT_HOST=0.0.0.0
    ENV NUXT_PORT=3000
    EXPOSE 3000
    
    # 直接用 Bun 运行编译后的服务器入口
    CMD ["bun", ".output/server/index.mjs"]
    