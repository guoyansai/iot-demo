<script setup lang="ts">
import InputNumber from './main/InputNumber.vue';
const props = defineProps<{
  node: any;
  labels: any;
}>();
const key = 'x';
</script>
<template>
  <InputNumber :node="node" :labels="labels" :keyName="key" />
</template>
