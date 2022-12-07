<script setup lang="ts">
import { inject } from 'vue';

const props = defineProps(['model', 'modelStore']);

const proModel: any = inject('proModel');

function setVal() {
  console.log(666.1005, proModel);
  props.model.type++;
  props.model.data.val++;
  props.modelStore.type++;
}
function setValZ() {
  console.log(666.1005, proModel);
  proModel.type++;
}
</script>

<template>
  <h1>C111从孙</h1>
  <el-button @click="setVal()">从孙加油</el-button>
  <el-button @click="setValZ()">注入加油</el-button>
  <div>proModel：{{ proModel }}</div>
  <div>model{{ model }}</div>
  <div>modelStore{{ modelStore }}</div>
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
</template>

<style scoped lang="scss"></style>
