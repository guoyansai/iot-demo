<script setup lang="ts">
import InputDefault from './main/InputDefault.vue';
const props = defineProps<{
  node: any;
  labels: any;
}>();
const key = 'setname';
</script>
<template>
  <InputDefault :node="node" :labels="labels" :keyName="key" />
</template>
