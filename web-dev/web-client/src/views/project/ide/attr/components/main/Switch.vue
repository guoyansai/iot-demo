<script setup lang="ts">
import AsSwitch from '@/components/ui/AsSwitch.vue';

const props = defineProps<{
  node: any;
  labels: any;
  keyName: string;
}>();
</script>
<template>
  <el-form-item :label="labels[keyName].lang">
    <AsSwitch v-model="node[keyName]" />
  </el-form-item>
</template>

<style scoped lang="scss"></style>
