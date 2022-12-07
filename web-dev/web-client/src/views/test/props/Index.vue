<script setup lang="ts">
import { provide, reactive, ref, toRaw } from 'vue';
import TestChild from './TestChild.vue';
import C1 from './C1.vue';
import IModel from './Type';
import ModelStore from './store';
// 通过状态管理
const modelStore = ModelStore().modelStore;

const model: IModel = reactive(toRaw(modelStore));

// 通过注入传值
provide('proModel', modelStore);

const hello = ref<any>(null);

const helloClick = () => {
  hello.value.count++;
  console.log(hello?.value?.count);
};

const add = (a: number, b: number) => {
  console.log(666.333, hello, hello.value.add(5, 6));
  hello.value.count = hello.value.add(a, b);
};
</script>
<template>
  <h1>父</h1>
  {{ model }}
  <C1 :model="model" :modelStore="modelStore"></C1>
  <div style="padding: 12px">
    <div>父组件读取子组件的值：{{ hello?.count }}</div>
    <el-button @click="helloClick">父组件</el-button>
    <el-button @click="add(8, 9)">add</el-button>
    <TestChild ref="hello"></TestChild>
  </div>
</template>

<style scoped lang="scss"></style>
