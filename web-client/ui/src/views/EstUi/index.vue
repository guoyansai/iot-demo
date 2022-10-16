<script setup lang="ts">
import EstUiVisualProgramming from './EstUiVisualProgramming/index.vue';
import EstUiDeveloperMode from './EstUiDeveloperMode/index.vue';
import EstUi3dSimulation from './EstUi3dSimulation/index.vue';
console.log(666.888);
</script>

<template>
  <el-row class="area fixed">
    <el-col class="area" :span="10">
      <EstUiVisualProgramming></EstUiVisualProgramming>
    </el-col>
    <el-col class="area" :span="6" v-if="false">
      <EstUiDeveloperMode></EstUiDeveloperMode>
    </el-col>
  </el-row>
  <el-row>
    <el-col class="area rela" :span="24">
      <EstUi3dSimulation></EstUi3dSimulation>
    </el-col>
  </el-row>
</template>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.rela {
  position: relative;
  z-index: -10;
}
</style>
