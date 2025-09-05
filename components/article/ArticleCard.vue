<script setup lang="ts">
import type { Article } from '~/types/Article'
const props = withDefaults(
    defineProps<{
      article: Article
      isLinked?: boolean
    }>(), { isLinked: true }
)

// 遮罩与按钮
const visible       = ref(props.article.sensitive)
const showButton    = ref(!props.article.sensitive)
const fromSensitive = ref(props.article.sensitive)   // ⟵ 新增

const handleShowContent = () => {
  visible.value = false
  fromSensitive.value = true         // 只有 sensitive 条目才会被设为 true
  setTimeout(() => { showButton.value = true }, 200)
}
</script>

<template>
  <v-card class="w-100 rounded-xl position-relative" style="overflow:visible;">
    <!-- 遮罩 -->
    <v-overlay v-model="visible" persistent contained
               class="align-center justify-center"
               style="backdrop-filter:blur(500px);background:rgba(255,255,255,.85);-webkit-backdrop-filter:blur(100px);">
      <span>本条目包含敏感信息</span>
      <v-btn @click="handleShowContent" color="primary" class="mx-8">显示</v-btn>
    </v-overlay>

    <!-- 详情按钮 -->
    <NuxtLink
        v-if="isLinked"
        :href="`/detail/` + article.id"
        class="detail-btn-link"
        :class="{
        'btn-show': showButton,
        'btn-slide': fromSensitive && showButton   /* 只有 sensitive 才加动画 */
      }">
      <v-btn icon size="small" class="detail-btn" elevation="2" color="primary">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </NuxtLink>

    <!-- 卡片正文 -->
    <v-card-title>
      <div class="text-overline">
        <v-row>
          <v-col>Author: {{ article.contributor }}</v-col>
          <v-spacer/>
          <v-col>Time: {{ article.time }}</v-col>
        </v-row>
      </div>
    </v-card-title>
    <v-card-subtitle class="text-deep-orange-accent-3">
      <span v-if="article.unsure">本条目包含了未经确定的信息</span>
    </v-card-subtitle>
    <v-card-text class="markdown-body" v-html="md_render(article.line)"/>
  </v-card>
</template>

<style scoped>
/* —— 通用样式 —— */
.v-card { overflow: visible; }
.markdown-body img {
  max-width:100%; height:85%; display:block; margin:0 auto; object-fit:contain;
}

/* —— markdown 表格样式修正 —— */
.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

.markdown-body table th {
  font-weight: bold !important;
  color: #000 !important;
  background-color: #f6f8fa;
  padding: 8px 12px;
  border: 1px solid #d0d7de;
  text-align: left;
}

.markdown-body table td {
  padding: 8px 12px;
  border: 1px solid #d0d7de;
}

.markdown-body table tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* 修正空行渲染问题 */
.markdown-body table tr:empty {
  display: none;
}

.markdown-body table td:empty::after {
  content: '\00a0';
}

/* 基础位置：贴在卡片右侧、初始隐藏 */
.detail-btn-link{
  position:absolute; top:50%; left:100%;
  transform:translateY(-50%) translateX(-100px);
  margin-left:8px; z-index:1; text-decoration:none;
  opacity:0; transition:all .6s cubic-bezier(.68,-.55,.265,1.55);
}
/* 按钮显示（无动画，仅位移 + 淡入） */
.detail-btn-link.btn-show{
  transform:translateY(-50%) translateX(0);
  opacity:1;
}
/* sensitive → 显示 时附加弹性动画 */
@keyframes buttonSlideIn{
  0%{transform:translateY(-50%) translateX(-100px) scale(.8);opacity:0;}
  70%{transform:translateY(-50%) translateX(5px)  scale(1.1);opacity:.8;}
  100%{transform:translateY(-50%) translateX(0)    scale(1);  opacity:1;}
}
.detail-btn-link.btn-slide{ animation:buttonSlideIn .6s cubic-bezier(.68,-.55,.265,1.55) forwards; }

/* 图标按钮缩放效果 */
.detail-btn{ transition:all .3s ease; transform:scale(.8); }
.detail-btn:hover{ transform:translateX(2px) scale(1.05); box-shadow:0 4px 8px rgba(0,0,0,.2) !important; }

/* —— 移动端自适应 —— */
@media (max-width:600px){
  /* 改为绝对定位在卡片内部右侧 */
  .detail-btn-link{
    left:auto; right:-48px;         /* 隐藏状态：稍微在卡片外 */
    transform:translateY(-50%);     /* 不再水平方向位移 */
  }
  .detail-btn-link.btn-show{ right:8px; }      /* 显示状态：与卡片保持 8px 间隙 */
  /* sensitive 动画：同样基于 right 位移 */
  @keyframes buttonSlideIn{
    0%  { right:-48px; opacity:0; transform:translateY(-50%) scale(.8); }
    70% { right:12px;  opacity:.8; transform:translateY(-50%) scale(1.1); }
    100%{ right:8px;   opacity:1;  transform:translateY(-50%) scale(1); }
  }
}
</style>
