<template>
  <v-container>
    <v-main>
      <v-row justify="center" class="fill-height">
        <v-col cols="12" md="8">
          <!-- 如果API返回非200状态码，显示404页面 -->
          <div v-if="showNotFound" class="error-container">
            <div class="error-content">
              <h1 class="error-title">404 Not Found</h1>
              <div class="error-message">
                <span class="error-path">{{ currentPath }}</span>
              </div>
              <p class="error-description">
                抱歉，您访问的页面不存在或已被移除
              </p>
              <button @click="goHome" class="home-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                返回首页
              </button>
            </div>
          </div>

          <!-- 如果成功获取到文章数据，显示文章卡片 -->
          <div v-else-if="article" class="article-container">
            <v-skeleton-loader
                type="article"
                :loading="loading"
                class="my-4 opacity-80 rounded-xl"
            >
              <article-card :article="article" :is-linked="false" />
            </v-skeleton-loader>
          </div>

          <!-- 加载状态 -->
          <div v-else class="loading-container">
            <v-skeleton-loader
                type="article"
                loading
                class="my-4 opacity-80 rounded-xl skeleton-fixed-width"
            />
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// 获取UUID参数
const uuid = route.params.uuid

// 获取当前路径，去掉开头的 /
const currentPath = computed(() => {
  const path = route.path
  return path.startsWith('/') ? path.slice(1) : path
})

// 响应式数据
const article = ref<Article | null>(null)
const showNotFound = ref(false)
const loading = ref(true)

// 获取单个文章的函数
async function fetchArticle(uuid: string): Promise<Article | undefined> {
  const url = useRuntimeConfig().public.apiUrl + `line/${uuid}`

  return $fetch<Article>(url, {
    method: 'GET',
  }).then((data) => {
    return data ?? undefined
  }).catch(err => {
    console.error(err)
    return undefined
  })
}

// 获取文章数据
const loadArticle = async () => {
  if (!uuid) {
    showNotFound.value = true
    loading.value = false
    return
  }

  try {
    loading.value = true
    const result = await fetchArticle(uuid as string)
    if (result) {
      article.value = result
    } else {
      showNotFound.value = true
    }
  } catch (error) {
    console.error('Failed to fetch article:', error)
    showNotFound.value = true
  } finally {
    loading.value = false
  }
}

// 返回首页
const goHome = () => {
  navigateTo('/')
}

// 设置页面标题
useHead({
  title: '内容详情'
})

// 组件挂载时获取数据
onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.article-container {
  width: 100%;
}

.skeleton-fixed-width {
  width: 100% !important;
  max-width: 100% !important;
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.error-icon {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.error-title {
  font-size: 3rem;
  font-weight: 900;
  color: #374151;
  margin: 0;
  line-height: 1;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.error-message {
  margin-bottom: 2rem;
  font-size: 1.5rem;
  line-height: 1.4;
}

.error-path {
  display: block;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 1.25rem;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  margin-bottom: 0.75rem;
  word-break: break-all;
}

.not-found-text {
  display: block;
  font-size: 1.75rem;
  font-weight: 600;
  color: #374151;
}

.error-description {
  font-size: 1.125rem;
  color: #6B7280;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.home-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  background: transparent;
  border: 2px solid #D1D5DB;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.home-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.home-button:hover::before {
  background: rgba(255, 255, 255, 0.5);
}

.home-button:hover {
  border-color: #9CA3AF;
  color: #1F2937;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.home-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.home-button svg {
  transition: transform 0.3s ease;
}

.home-button:hover svg {
  transform: translateX(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-title {
    font-size: 6rem;
  }

  .error-message {
    font-size: 1.25rem;
  }

  .error-path {
    font-size: 1rem;
  }

  .not-found-text {
    font-size: 1.5rem;
  }

  .error-description {
    font-size: 1rem;
  }

  .home-button {
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .error-container {
    padding: 1rem;
  }

  .error-content {
    padding: 2rem 1.5rem;
  }

  .error-title {
    font-size: 4.5rem;
  }

  .error-icon svg {
    width: 80px;
    height: 80px;
  }
}
</style>
