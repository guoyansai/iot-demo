<script setup lang="ts">
import configTools from '../../config/config-tools.json';
import Tool from './Tool.vue';

const props = defineProps<{
  model: any;
}>();
</script>
<template>
  <el-container class="as-area">
    <el-header class="as-area-tit">{{ configTools.label }}</el-header>
    <el-main class="as-area-main">
      <Tool :model="model" :tool="configTools"></Tool>
    </el-main>
  </el-container>
</template>
<style scoped lang="scss"></style>
