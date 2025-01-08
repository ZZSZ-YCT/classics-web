<script setup lang="ts">
import type {Article} from "~/types/Article";

const props = defineProps<{
  article: Article
}>()

const visible = ref(props.article.sensitive)
</script>

<template>
  <v-card class="w-100 rounded-xl">
    <v-overlay v-model="visible" contained class="align-center justify-center" style="backdrop-filter: blur(4px);">
      <span>本条目包含敏感信息</span>
      <v-btn @click="visible = false" color="primary" class="mx-8">显示</v-btn>
    </v-overlay>

    <v-card-title>
      <div class="text-overline">
        <v-row>
          <v-col>
            Author: {{ article.contrib }}
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            Time: {{ article.time }}
          </v-col>
        </v-row>
      </div>
    </v-card-title>
    <v-card-subtitle class="text-deep-orange-accent-3">
      <span v-if="article.unsure">
        本条目包含了未经确定的信息
      </span>
    </v-card-subtitle>
    <v-card-text>
      {{ article.line }}
    </v-card-text>
  </v-card>
</template>