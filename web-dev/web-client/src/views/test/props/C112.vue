<script setup lang="ts">
import { inject } from 'vue';

const props = defineProps(['data', 'dataStore']);

const proModel: any = inject('proModel');

function setVal() {
  props.data.val++;
  props.dataStore.val++;
}
function setValZ() {
  proModel.type++;
}
</script>

<template>
  <h1>C112从孙</h1>
  <el-button @click="setVal()">从孙加油</el-button>
  <el-button @click="setValZ()">注入加油</el-button>
  <div>proModel：{{ proModel }}</div>
  <div>data{{ data }}</div>
  <div>dataStore{{ dataStore }}</div>
  <el-form label-width="100px" inline>
    <el-form-item label="aa内">
      <el-input v-model="dataStore.val"></el-input>
    </el-form-item>
    <el-form-item label="内">
      <el-input v-model="data.val"></el-input>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
