<script setup lang="ts">
import AsColor from '@/components/ui/AsColor.vue';

const props = defineProps<{
  node: any;
  labels: any;
  keyName: string;
}>();
</script>
<template>
  <el-form-item :label="labels[keyName].lang">
    <AsColor v-model="node[keyName]"></AsColor>
  </el-form-item>
</template>

<style scoped lang="scss"></style>
