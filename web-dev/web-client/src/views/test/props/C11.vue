<script setup lang="ts">
import C111 from './C111.vue';
import C112 from './C112.vue';
defineProps(['model', 'modelStore']);
</script>

<template>
  <h1>C11孙</h1>
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
  <C111 :model="model" :modelStore="modelStore"></C111>
  <C112 :data="model.data" :dataStore="modelStore.data"></C112>
</template>

<style scoped lang="scss"></style>
