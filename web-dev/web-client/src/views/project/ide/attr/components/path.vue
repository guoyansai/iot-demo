<script setup lang="ts">
import InputDefault from './main/InputDefault.vue';
const props = defineProps<{
  node: any;
  labels: any;
}>();
const key = 'path';
</script>
<template>
  <InputDefault :node="node" :labels="labels" :keyName="key" />
</template>
