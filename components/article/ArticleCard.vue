<script setup lang="ts">
import type {Article} from "~/types/Article";

const props = defineProps<{
  article: Article
}>()
</script>

<template>
  <v-card class="w-100">
    <v-card-title class="title-ellipsis">
      {{article.line}}
    </v-card-title>
    <v-card-subtitle v-if="article.unsure" class="text-deep-orange-accent-3">
      本条目包含了未经确定的信息
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col>
          Author: {{ article.contrib }}
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          Time: {{ article.time }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.title-ellipsis {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>