<script setup lang="ts">
import Color from '../main/Color.vue';
const props = defineProps<{
  node: any;
  labels: any;
}>();
const key = 'color';
</script>
<template>
  <Color :node="node" :labels="labels" :keyName="key" />
</template>
