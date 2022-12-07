<script setup lang="ts">
import { useIndex } from './useIndex';
const {
  model,
  vResize,
  LayoutTool,
  LayoutProgram,
  LayoutPoint,
  LayoutPointAttr,
  LayoutProject,
  LayoutSimulate,
} = useIndex();
</script>

<template>
  <el-container class="as-area">
    <el-aside width="121px" id="toolsDom">
      <LayoutTool :model="model"></LayoutTool>
    </el-aside>
    <el-aside
      class="area-drag-col"
      v-resize="{ type: 'left', dom: 'toolsDom' }"
    ></el-aside>

    <el-aside width="360px" id="programsTreeDom">
      <LayoutProgram :model="model" skin="tree"></LayoutProgram>
    </el-aside>
    <el-aside
      class="area-drag-col"
      v-resize="{ type: 'left', dom: 'programsTreeDom' }"
    ></el-aside>
    <el-aside width="228px" id="pointDom">
      <el-container>
        <el-main>
          <LayoutPoint :model="model" skin="point"></LayoutPoint>
        </el-main>
        <el-footer
          class="area-drag-row"
          v-resize="{ type: 'bottom', dom: 'projectDom' }"
        ></el-footer>
        <el-footer height="428px" id="projectDom">
          <LayoutProject :model="model"></LayoutProject>
        </el-footer>
      </el-container>
    </el-aside>
    <el-aside
      class="area-drag-col"
      v-resize="{ type: 'left', dom: 'pointDom' }"
    ></el-aside>
    <el-main>
      <el-container class="area-3d">
        <el-main><LayoutSimulate :model="model"></LayoutSimulate></el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.el-container {
  height: 100%;
  max-height: 100%;
  overflow: auto;
}
.area-3d {
}
.area-drag-row {
  height: 5px;
  background-color: #e7e6e4;
  cursor: move;
}
.area-drag-col {
  width: 5px;
  background-color: #e7e6e4;
  cursor: move;
}
</style>
