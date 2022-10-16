F
<script setup lang="ts">
import HelloWorld from '../components/HelloWorld.vue';
import Editor from './Editor/index.vue';
import LowCode from './LowCode/index.vue';
import Preview from './Preview/index.vue';

import storeaa from '../store';
import { provide, ref } from 'vue';
provide('globalFlag', ref(1));
</script>

<template>
  <el-row class="area">
    <el-col :span="5">
      <LowCode></LowCode>
    </el-col>
    <el-col :span="5" class="border-left">
      <Editor></Editor>
    </el-col>
    <el-col :span="10" class="border-left">
      <Preview></Preview>
    </el-col>
    <el-col :span="4" class="border-left">
      <HelloWorld msg="vue-template" />
      <MyHead></MyHead>
    </el-col>
  </el-row>
</template>

<style scoped></style>
