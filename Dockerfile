FROM oven/bun:latest AS builder
WORKDIR /app

# 1. 先只拷贝锁文件和元数据，安装所有依赖（包括老版本 esbuild）
COPY package.json bun.lockb ./
RUN bun install

# 2. 用 bun 在容器里把 esbuild 升级到跟 bun 自带服务相同的版本
RUN bun add esbuild@0.25.2 --save-dev

# 3. 拷贝项目源码并构建
COPY . .
RUN bun run build
    
    # ----------------------------
    # 第二阶段：运行时镜像
    # ----------------------------
FROM oven/bun:latest AS runner
    
WORKDIR /app
COPY --from=builder /app/.output ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000
CMD ["bun", "run", "preview", "--", "--hostname", "0.0.0.0", "--port", "3000"]
    