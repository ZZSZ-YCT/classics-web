<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { nextTick, ref, reactive, watch, onMounted, computed } from 'vue';

useHead({
  title: '典籍提交'
})

/* ——— 运行时配置 ——— */
const {
  public: { turnstileSiteKey },
} = useRuntimeConfig();

/* ——— 表单数据 & 本地缓存 ——— */
const formData = reactive({
  contrib: '',
  time: '',
  line: '',
  unsure: false,
  sensitive: false,
});

onMounted(() => {
  if (process.client) {
    const cache = localStorage.getItem('article_draft');
    if (cache) {
      try {
        Object.assign(formData, JSON.parse(cache));
      } catch {}
    }
  }
});

watch(
    formData,
    (v) => process.client && localStorage.setItem('article_draft', JSON.stringify(v)),
    { deep: true }
);

function clearCache() {
  if (process.client) localStorage.removeItem('article_draft');
}

/* ——— 预览对象 / 蒙层 ——— */
const previewArticle = computed(() => ({
  id: 'preview',
  ...formData,
  contrib: formData.contrib || '作者/贡献者',
  time: formData.time || '2024-08-26',
  line: formData.line || '请输入条目内容…',
}));

const overlayVisible = ref(previewArticle.value.sensitive);
watch(
    () => formData.sensitive,
    (v) => (overlayVisible.value = v),
    { immediate: true }
);

/* ——— 全局通知 ——— */
interface Alert {
  id: number;
  type: 'success' | 'error';
  text: string;
}
const alerts = ref<Alert[]>([]);
function pushAlert(type: Alert['type'], text: string) {
  const id = Date.now() + Math.random();
  alerts.value.push({ id, type, text });
  setTimeout(() => {
    alerts.value = alerts.value.filter((a) => a.id !== id);
  }, 3000);
}

/* ——— Turnstile 对话框 ——— */
const cfDialog = ref(false);
const cfContainer = ref<HTMLElement | null>(null);
const cfReady = ref(false);

function loadCFScript() {
  if (typeof window === 'undefined') return;
  if ((window as any).turnstile) {
    cfReady.value = true;
    return;
  }
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  s.async = true;
  s.defer = true;
  s.onload = () => (cfReady.value = true);
  document.head.appendChild(s);
}
onMounted(loadCFScript);

watch(cfDialog, async (open) => {
  if (open && cfReady.value) {
    await nextTick();
    renderTurnstile();
  }
});

function renderTurnstile() {
  if (!cfContainer.value) return;
  cfContainer.value.innerHTML = ''; // 清空旧 widget
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.turnstile.render(cfContainer.value, {
    sitekey: turnstileSiteKey,
    callback(token: string) {
      cfDialog.value = false;
      sendData(token);
    },
    'error-callback': () => pushAlert('error', '验证码加载失败，请重试'),
  });
}

/* ——— 提交逻辑 ——— */
const formRef = ref();
const isSubmitting = ref(false);

async function handleSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    pushAlert('error', '请填写所有必填字段');
    return;
  }
  cfDialog.value = true; // 打开 Turnstile 对话框
}

async function sendData(cfToken: string) {
  isSubmitting.value = true;
  try {
    const res: { ok: boolean } = await $fetch('/api/submit-line', {
      method: 'POST',
      body: {
        ...formData,
        cfToken,
      },
    });

    if (res.ok) {
      pushAlert('success', '提交成功！');
      formRef.value.reset(); // 清空验证 & 输入
      Object.assign(formData, {
        contrib: '',
        time: '',
        line: '',
        unsure: false,
        sensitive: false,
      });
      overlayVisible.value = false;
      clearCache();
    } else {
      pushAlert('error', '提交失败，请稍后重试');
    }
  } catch (e: any) {
    pushAlert('error', e?.data?.message || '提交失败，请检查网络');
  } finally {
    isSubmitting.value = false;
  }
}

/* ——— 其它 UI ——— */
const md_render = (s: string) => s.replace(/\n/g, '<br>');
const { mobile, height } = useDisplay();
const availableHeight = computed(() => height.value - 100);
</script>

<template>


  <!-- 全局通知 -->
  <div class="global-alert-container">
    <v-alert
        v-for="a in alerts"
        :key="a.id"
        :type="a.type"
        density="comfortable"
        border="left"
        :icon="a.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"
        class="global-alert"
    >
      {{ a.text }}
    </v-alert>
  </div>

  <!-- Turnstile 对话框 -->
  <!-- Turnstile 对话框 -->
  <v-dialog v-model="cfDialog" persistent max-width="420">
    <v-card>
      <!-- 标题 + 右上关闭 -->
      <v-card-title class="text-h6 d-flex align-center">
        <span>请完成人机验证</span>
        <v-spacer />
      </v-card-title>

      <!-- 验证组件 -->
      <v-card-text class="pt-4 pb-6 d-flex justify-center">
        <div ref="cfContainer"></div>
      </v-card-text>

      <!-- 底部取消按钮 -->
      <v-card-actions class="justify-end">
        <v-btn text @click="cfDialog = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 主体 -->
  <v-container
      fluid
      class="submit-page fill-height"
      :style="`max-height: ${availableHeight}px; overflow-y: auto;`"
  >
    <NuxtLink to="/" class="home-link">
      <v-btn color="primary" rounded prepend-icon="mdi-arrow-left">
        回到首页
      </v-btn>
    </NuxtLink>
    <v-row justify="center" no-gutters class="fill-height">
      <v-col cols="12" sm="11" md="10" lg="8" xl="6" class="d-flex flex-column">
        <!-- 表单 -->
        <v-card class="rounded-xl mb-3 flex-shrink-0" elevation="2">
          <v-card-title class="pa-4 pb-2">
            <v-icon left color="primary" :size="mobile ? 'default' : 'large'">mdi-plus-circle</v-icon>
            <span :class="mobile ? 'text-h6' : 'text-h5'">提交新条目</span>
          </v-card-title>

          <v-card-text class="pa-4 pt-2">
            <v-form ref="formRef" @submit.prevent="handleSubmit">
              <!-- 作者 / 时间 -->
              <v-row dense class="mb-2">
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="formData.contrib"
                      label="作者(贡献者)"
                      required
                      outlined
                      dense
                      hide-details="auto"
                      :rules="[v => !!v || '请输入作者姓名']"
                  >
                    <template #prepend-inner>
                      <v-icon color="grey" size="small">mdi-account</v-icon>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="formData.time"
                      label="时间"
                      required
                      outlined
                      dense
                      hide-details="auto"
                      placeholder="例: 2024-08-26"
                      :rules="[v => !!v || '请输入时间']"
                  >
                    <template #prepend-inner>
                      <v-icon color="grey" size="small">mdi-clock</v-icon>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <!-- 条目内容 -->
              <v-textarea
                  v-model="formData.line"
                  label="条目内容"
                  required
                  outlined
                  hide-details="auto"
                  :rows="mobile ? 3 : 4"
                  :max-rows="mobile ? 5 : 6"
                  class="mb-3"
                  :rules="[v => !!v || '请输入条目内容']"
              >
                <template #prepend-inner>
                  <v-icon color="grey" size="small">mdi-text</v-icon>
                </template>
              </v-textarea>

              <!-- 复选框 -->
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-checkbox
                      v-model="formData.unsure"
                      label="该条目不确定"
                      color="warning"
                      dense
                      hide-details
                      class="mt-0"
                  >
                    <template #prepend>
                      <v-icon color="warning" size="small">mdi-help-circle</v-icon>
                    </template>
                  </v-checkbox>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-checkbox
                      v-model="formData.sensitive"
                      label="该条目敏感"
                      color="error"
                      dense
                      hide-details
                      class="mt-0"
                  >
                    <template #prepend>
                      <v-icon color="error" size="small">mdi-eye-off</v-icon>
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- 预览 -->
        <div class="flex-grow-1 d-flex flex-column min-height-0">
          <div class="d-flex align-center mb-2">
            <span :class="['preview-title', mobile ? 'text-subtitle1' : 'text-h6']">
              <v-icon color="primary" size="small" class="mr-2">mdi-eye</v-icon>
              预览效果
            </span>
            <v-spacer />
          </div>

          <v-card class="w-100 rounded-xl position-relative preview-card">
            <!-- 蒙层 -->
            <v-overlay
                v-model="overlayVisible"
                persistent
                contained
                class="align-center justify-center"
                style="
                backdrop-filter: blur(500px);
                background: rgba(255, 255, 255, 0.85);
                -webkit-backdrop-filter: blur(100px);
              "
            >
              <span>本条目包含敏感信息</span>
              <v-btn color="primary" class="mx-8" @click="overlayVisible = false">显示</v-btn>
            </v-overlay>

            <v-btn
                v-if="!overlayVisible && previewArticle.sensitive"
                icon
                size="x-small"
                color="error"
                class="restore-btn"
                @click="overlayVisible = true"
            >
              <v-icon size="x-small">mdi-eye-off</v-icon>
            </v-btn>

            <v-card-title>
              <div class="text-overline">
                <v-row>
                  <v-col>Author: {{ previewArticle.contrib }}</v-col>
                  <v-spacer />
                  <v-col>Time: {{ previewArticle.time }}</v-col>
                </v-row>
              </div>
            </v-card-title>
            <v-card-subtitle class="text-deep-orange-accent-3">
              <span v-if="previewArticle.unsure">本条目包含了未经确定的信息</span>
            </v-card-subtitle>
            <v-card-text class="markdown-body" v-html="md_render(previewArticle.line)" />
          </v-card>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-section mt-3 flex-shrink-0">
          <v-btn
              @click="handleSubmit"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              color="primary"
              :size="mobile ? 'large' : 'x-large'"
              class="submit-btn"
              elevation="3"
              block
          >
            <v-icon left>mdi-send</v-icon>
            {{ isSubmitting ? '提交中…' : '提交条目' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* —— 容器定位上下文 —— */
.submit-page {
  position: relative;   /* 新增：使其成为定位上下文 */
  padding: 16px 8px 8px 8px;
  margin-top: 64px;
}

/* —— “回到首页” 按钮 —— */
.home-link {
  position: absolute;   /* 新增：绝对定位 */
  top: 16px;            /* 距离容器顶部 16px */
  left: 16px;           /* 距离容器左侧 16px */
  text-decoration: none;
  z-index: 1000;        /* 保证在最上层 */
}

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;                       /* 与常规 app‑bar 高度一致 */
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08); /* 形成“横线” */
  z-index: 10000;                     /* 高于其他浮层 */
}

/* ——— 顶栏内链接 ——— */
.home-link {
  text-decoration: none;              /* 去掉 <a> 默认下划线 */
}

/* ——— 全局通知容器 ——— */
.global-alert-container {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.global-alert {
  width: 320px;
}

/* ——— 预览标题背景 ——— */
.preview-title {
  background: rgba(255, 255, 255, 0.6);
  padding: 0 6px;
  border-radius: 4px;
  backdrop-filter: blur(2px);
}

/* ——— 恢复蒙层按钮 ——— */
.restore-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
}

/* ——— 页面基础布局 ——— */
.submit-page {
  padding: 16px 8px 8px 8px;
  margin-top: 64px;
}

@media (max-width: 600px) {
  .submit-page {
    margin-top: 56px;
    padding: 8px 4px 4px 4px;
  }
}

/* ——— 预览卡片 ——— */
.preview-card {
  border: 2px dashed rgba(25, 118, 210, 0.3) !important;
}

/* ——— markdown 图片 ——— */
.markdown-body img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 8px auto;
  border-radius: 4px;
}

/* ——— 提交按钮效果 ——— */
.submit-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 56px !important;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.4) !important;
}

.submit-btn:active {
  transform: translateY(0);
}

@media (max-width: 600px) {
  .submit-btn {
    height: 48px !important;
    font-size: 16px !important;
  }
}

/* ——— 表单元素过渡 ——— */
.v-text-field,
.v-textarea,
.v-card,
.v-checkbox {
  transition: all 0.2s ease;
}

.v-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

/* ——— 滚动条美化 ——— */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* ——— 过渡动画 ——— */
.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition: opacity 0.3s ease;
}

.v-fade-transition-enter-from,
.v-fade-transition-leave-to {
  opacity: 0;
}

/* ——— 工具类 ——— */
.min-height-0 {
  min-height: 0;
}
</style>
