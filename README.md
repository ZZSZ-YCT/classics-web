# 典籍收录 (Classics Collection)

一个基于 Nuxt 3 构建的典籍条目收录与展示平台，支持用户提交、浏览和管理经典文献条目，具有 Markdown 编辑、实时预览、内容审核等功能。

## ✨ 功能特性

- 📚 **条目浏览**：瀑布流展示典籍条目，支持懒加载优化
- ✍️ **内容提交**：支持 Markdown 格式的条目提交，实时预览
- 🛡️ **安全防护**：集成 Cloudflare Turnstile 人机验证
- 🎨 **现代界面**：基于 Vuetify Material Design 3 设计
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🔍 **详情页面**：独立的条目详情展示页面
- 💾 **本地缓存**：表单数据自动保存，防止意外丢失
- 🚀 **性能优化**：骨架屏加载、图片优化、代码分割

## 🛠️ 技术栈

- **前端框架**：[Nuxt 3](https://nuxt.com/) - Vue.js 全栈框架
- **UI 组件库**：[Vuetify](https://vuetifyjs.com/) - Material Design 组件库
- **状态管理**：[Pinia](https://pinia.vuejs.org/) - Vue 状态管理
- **Markdown 渲染**：[markdown-it](https://github.com/markdown-it/markdown-it) - 支持数学公式和图片大小控制
- **图标库**：[Material Design Icons](https://materialdesignicons.com/)
- **安全验证**：Cloudflare Turnstile
- **开发工具**：TypeScript、Bun

## 📁 项目结构

```
classics-web/
├── components/          # Vue 组件
│   ├── MarkdownEditor.vue    # Markdown 编辑器组件
│   └── article/             # 文章相关组件
│       └── ArticleCard.vue  # 文章卡片组件
├── pages/              # 页面路由
│   ├── index.vue       # 首页 - 条目列表
│   ├── commit.vue      # 提交页面
│   ├── detail/         
│   │   └── [uuid].vue  # 条目详情页
│   ├── login.vue       # 登录页面
│   └── [...404].vue    # 404 页面
├── server/             # 服务端 API
│   └── api/
│       └── submit-line.post.ts  # 条目提交接口
├── stores/             # Pinia 状态管理
│   ├── ArticlesStore.ts # 文章数据管理
│   └── UserStore.ts     # 用户状态管理
├── types/              # TypeScript 类型定义
│   ├── Article.ts       # 文章类型
│   └── Authorization.ts # 授权类型
├── utils/              # 工具函数
│   ├── authorization.ts # 授权工具
│   ├── requests.ts      # 请求工具
│   └── renderer.js      # Markdown 渲染器
└── nuxt.config.ts      # Nuxt 配置文件
```

## 🚀 快速开始

### 环境要求

- Node.js 18+ 或 Bun 1.0+
- 现代浏览器（支持 ES2020+）

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 pnpm
pnpm install

# 使用 yarn
yarn install

# 使用 bun（推荐）
bun install
```

### 环境配置

创建 `.env` 文件并配置以下环境变量：

```env
# Cloudflare Turnstile 配置
TURNSTILE_SITE_KEY=你的站点密钥
TURNSTILE_SECRET_KEY=你的私密密钥

# API 配置
CLASSICS_API_JWT=后端API的JWT令牌
```

### 开发服务器

启动开发服务器（默认运行在 `http://localhost:3000`）：

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### 生产构建

```bash
# 构建应用
bun run build

# 预览生产版本
bun run preview
```

## 📝 主要功能说明

### 条目浏览

- 首页展示所有已提交的典籍条目
- 瀑布流布局，前10条默认展示，其余延迟加载
- 支持骨架屏加载状态
- 点击条目可跳转到详情页面

### 条目提交

- 支持 Markdown 格式编辑，包括：
  - 文本格式化（粗体、斜体等）
  - 数学公式渲染（KaTeX）
  - 图片插入和大小控制
  - 表格、列表等
- 实时预览功能
- 表单数据本地缓存
- Cloudflare Turnstile 人机验证
- 敏感内容标记和模糊处理

### 内容管理

- 条目状态标记（不确定、敏感）
- 隐藏/显示敏感内容
- 作者信息和时间记录

## 🎨 UI/UX 特性

- **Material Design 3**：现代化的设计语言
- **响应式布局**：适配各种屏幕尺寸
- **暗色模式支持**：（计划中）
- **动画效果**：平滑的过渡和交互动画
- **无障碍访问**：遵循 WCAG 标准

## 🔧 配置说明

### Nuxt 配置

主要配置项（`nuxt.config.ts`）：

- **Vuetify 集成**：使用 Material Design 3 蓝图
- **MDI 图标**：本地化图标字体
- **多语言支持**：默认中文（zh-CN）
- **API 代理**：配置后端 API 地址
- **Source Map**：开发和生产环境源码映射

### Markdown 渲染器

支持的扩展功能：

- **数学公式**：KaTeX 渲染支持
- **图片大小**：支持指定图片尺寸
- **表格优化**：美化表格样式
- **代码高亮**：（可扩展）

## 📦 部署

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Docker 部署

```bash
# 构建镜像
docker build -t classics-web .

# 运行容器
docker run -p 3000:3000 classics-web
```

### 静态部署

```bash
# 生成静态文件
bun run generate

# 部署 dist/ 目录到静态托管服务
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -m '✨ feat: add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建 Pull Request

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `✨ feat:` 新功能
- `🐛 fix:` 错误修复
- `📝 docs:` 文档更新
- `💄 style:` 代码格式调整
- `♻️ refactor:` 重构
- `⚡ perf:` 性能优化
- `✅ test:` 测试相关
- `🔧 chore:` 构建过程或辅助工具的变动

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🔗 相关链接

- [Nuxt 3 文档](https://nuxt.com/docs)
- [Vuetify 文档](https://vuetifyjs.com/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Markdown-it 文档](https://markdown-it.github.io/)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和开源社区。

---

*如有问题或建议，欢迎提交 Issue 或 Pull Request。*