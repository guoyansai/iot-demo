<template>
  <div>子组件{{ count }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const count = ref(123456);

const add = (a: number, b: number): number => {
  return a + b;
};

defineExpose({
  add,
  count,
});
</script>
