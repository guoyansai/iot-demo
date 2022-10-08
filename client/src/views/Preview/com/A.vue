<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const Y = defineAsyncComponent(() => import('./Y.vue'));
</script>

<template>
  <div>AAAAAA</div>
  <Suspense>
    <template #default>
      <Y></Y>
    </template>
    <template #fallback> loading.... </template>
  </Suspense>
  {{ $appName }}
  <el-button @click="$appName.ver++">1全局变量加1</el-button>
  {{ $appModel }}
  <el-button @click="$appModel.ver++">2全局变量加1</el-button>
</template>

<style scoped></style>
