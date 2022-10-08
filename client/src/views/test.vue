<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const toPage = (url: string) => {
  //   router.push('/reg')
  //   router.replace('/reg') //无历史记录

  // router.push({
  //     name: 'Reg'
  //   })

  router.push({
    path: url,
  });
};
</script>

<template>
  <div>
    <el-button @click="toPage('/')">回主页</el-button>
    <router-link to="/">主页</router-link>
  </div>
</template>

<style scoped></style>
