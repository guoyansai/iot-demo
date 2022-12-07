<script setup lang="ts">
const props = defineProps<{
  node: any;
  labels: any;
  keyName: string;
}>();
</script>
<template>
  <el-form-item :label="labels[keyName].lang">
    <el-input-number v-model="node[keyName]" />
  </el-form-item>
</template>

<style scoped lang="scss"></style>
