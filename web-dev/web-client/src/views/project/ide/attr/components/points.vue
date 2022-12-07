<script setup lang="ts">
import Input from './main/InputDefault.vue';
const props = defineProps<{
  node: any;
  labels: any;
}>();
const key = 'points';
</script>
<template>
  <el-form-item :label="key">
    <div v-for="item in node[key]">{{ item }}</div>
  </el-form-item>
</template>
