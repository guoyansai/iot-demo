<script setup lang="ts">
import Switch from './main/Switch.vue';
const props = defineProps<{
  node: any;
  labels: any;
}>();
const key = 'candrop';
</script>
<template>
  <Switch :node="node" :labels="labels" :keyName="key" />
</template>
