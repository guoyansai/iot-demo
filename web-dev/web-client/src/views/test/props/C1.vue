<script setup lang="ts">
import { ref } from 'vue';
import C11 from './C11.vue';
const props = defineProps(['model', 'modelStore']);

function setVal() {
  props.model.type++;
  props.model.data.val++;
}
const model = props.model;
function setValW() {
  model.type++;
  model.data.val++;
}

const count = ref(123456);
const add = (a: number, b: number): number => {
  return a + b;
};
defineExpose({
  add,
  count,
  setVal,
});
</script>

<template>
  <h1>C1子</h1>
  <el-button @click="setVal()">加油</el-button>
  <el-button @click="setValW()">外人加油</el-button>
  <div>{{ model }}</div>
  <div>{{ modelStore }}</div>
  <el-form label-width="100px" inline>
    <el-form-item label="aa外">
      <el-input v-model="modelStore.type"></el-input>
    </el-form-item>
    <el-form-item label="aa内">
      <el-input v-model="modelStore.data.val"></el-input>
    </el-form-item>
    <el-form-item label="外">
      <el-input v-model="model.type"></el-input>
    </el-form-item>
    <el-form-item label="内">
      <el-input v-model="model.data.val"></el-input>
    </el-form-item>
  </el-form>
  <C11 :model="model" :modelStore="modelStore"></C11>
</template>

<style scoped lang="scss"></style>
