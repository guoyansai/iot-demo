<script setup lang="ts">
import TreeTasks from '../../components/tree/TreeTasks.vue';
import IndexType from '../../index/Type.vue';

// 向下尽量保持整个模型传递
const props = defineProps<{
  model: any;
  skin?: string;
}>();
</script>

<template>
  <el-container class="as-area">
    <el-header class="as-area-tit">
      <el-row>
        <el-col :span="12">可视化编程</el-col>
        <el-col :span="12" class="as-area-opt">
          <IndexType :model="model"></IndexType>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="as-area-main">
      <TreeTasks :model="model" taskstype="programs" :skin="skin"></TreeTasks>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.as-area-main {
  height: 100vh;
  margin: 0;
}
</style>
