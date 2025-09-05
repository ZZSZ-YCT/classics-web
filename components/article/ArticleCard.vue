<script setup lang="ts">
import type {Article} from "~/types/Article";
const props = withDefaults(
    defineProps<{
      article: Article
      isLinked?: boolean
    }>(),
    {
      isLinked: true,
    }
)

// 控制敏感内容遮罩的显示
const visible = ref(props.article.sensitive)
// 控制按钮的显示状态
const showButton = ref(!props.article.sensitive)

// 点击显示按钮后的处理
const handleShowContent = () => {
  visible.value = false
  // 延迟显示按钮，等待遮罩动画完成
  setTimeout(() => {
    showButton.value = true
  }, 200)
}
</script>

<template>
  <v-card class="w-100 rounded-xl position-relative" style="overflow: visible;">
    <v-overlay
        v-model="visible"
        persistent
        contained
        class="align-center justify-center"
        style="backdrop-filter: blur(500px);
             background: rgba(255,255,255,0.85);
             -webkit-backdrop-filter: blur(100px);"
    >
      <span>本条目包含敏感信息</span>
      <v-btn @click="handleShowContent" color="primary" class="mx-8">显示</v-btn>
    </v-overlay>

    <!-- 圆形详细按钮 - 放在右侧 -->
    <NuxtLink
        :href="`/detail/` + article.id"
        class="detail-btn-link"
        :class="{ 'btn-show': showButton }"
        v-if="isLinked"
    >
      <v-btn
          icon
          size="small"
          class="detail-btn"
          :class="{ 'btn-animate': showButton }"
          elevation="2"
          color="primary"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </NuxtLink>

    <v-card-title>
      <div class="text-overline">
        <v-row>
          <v-col>Author: {{ article.contributor }}</v-col>
          <v-spacer></v-spacer>
          <v-col>Time: {{ article.time }}</v-col>
        </v-row>
      </div>
    </v-card-title>
    <v-card-subtitle class="text-deep-orange-accent-3">
      <span v-if="article.unsure">本条目包含了未经确定的信息</span>
    </v-card-subtitle>
    <v-card-text class="markdown-body" v-html="md_render(article.line)"></v-card-text>
  </v-card>
</template>

<style scoped>
/* 允许绝对定位的子元素超出卡片边界 */
.v-card {
  overflow: visible;
}

.markdown-body img {
  max-width: 100%;
  height: 85%;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}

/* 按钮贴在卡片右侧 */
.detail-btn-link {
  position: absolute;
  top: 50%;
  left: 100%;             /* 紧贴卡片右边 */
  transform: translateY(-50%) translateX(-100px); /* 初始位置在左侧隐藏 */
  margin-left: 8px;       /* 和卡片之间的间隙 */
  z-index: 1;
  text-decoration: none;
  opacity: 0;             /* 初始透明 */
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* 弹性缓动 */
}

/* 按钮显示状态 */
.detail-btn-link.btn-show {
  transform: translateY(-50%) translateX(0); /* 移动到最终位置 */
  opacity: 1;             /* 完全不透明 */
}

.detail-btn {
  transition: all 0.3s ease;
  transform: scale(0.8);  /* 初始缩小 */
}

/* 按钮动画状态 */
.detail-btn.btn-animate {
  transform: scale(1);    /* 恢复正常大小 */
}

.detail-btn:hover {
  transform: translateX(2px) scale(1.05);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
}

/* 额外的动画效果 */
@keyframes buttonSlideIn {
  0% {
    transform: translateY(-50%) translateX(-100px) scale(0.8);
    opacity: 0;
  }
  70% {
    transform: translateY(-50%) translateX(5px) scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-50%) translateX(0) scale(1);
    opacity: 1;
  }
}

/* 为sensitive内容显示后的按钮添加特殊动画 */
.detail-btn-link.btn-show {
  animation: buttonSlideIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}
</style>
