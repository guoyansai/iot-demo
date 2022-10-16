<script setup lang="ts">
import { ref } from 'vue';

const asyncFun = () => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve('异步数据');
    }, 2000);
  });
};
// const str: string = await asyncFun();
const str = ref('hahaha');
</script>

<template>
  <div>哈哈哈哈哈{{ str }}哈哈哈哈哈</div>
</template>

<style scoped></style>
