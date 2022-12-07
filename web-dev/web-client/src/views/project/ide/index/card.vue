<script setup lang="ts">
import { useIndex } from './useIndex';
const {
  model,
  vResize,
  LayoutTool,
  LayoutProgram,
  LayoutProgramAttr,
  LayoutPoint,
  LayoutPointAttr,
  LayoutProject,
  LayoutSimulate,
} = useIndex();
</script>

<template>
  <el-container class="as-area">
    <el-aside width="60%" id="programsDom">
      <el-container>
        <el-aside width="121px" id="toolDom">
          <LayoutTool :model="model"></LayoutTool>
        </el-aside>

        <el-aside
          class="area-drag-col"
          v-resize="{ type: 'left', dom: 'toolDom' }"
        ></el-aside>

        <el-main>
          <el-container>
            <el-main>
              <LayoutProgram :model="model" skin="card"></LayoutProgram>
            </el-main>
            <el-aside
              class="area-drag-col"
              v-resize="{ type: 'right', dom: 'programAttrDom' }"
            ></el-aside>
            <el-aside width="228px" id="programAttrDom">
              <el-container>
                <el-main
                  ><LayoutProgramAttr :model="model"></LayoutProgramAttr
                ></el-main>
                <el-footer
                  class="area-drag-row"
                  v-resize="{ type: 'bottom', dom: 'taskdOM' }"
                ></el-footer>
                <el-footer height="428px" id="taskdOM">
                  <LayoutProject :model="model"></LayoutProject>
                </el-footer>
              </el-container>
            </el-aside>
          </el-container>
        </el-main>
      </el-container>
    </el-aside>

    <el-aside
      class="area-drag-col"
      v-resize="{ type: 'left', dom: 'programsDom' }"
    ></el-aside>

    <el-main>
      <el-container class="area-3d">
        <el-main><LayoutSimulate :model="model"></LayoutSimulate></el-main>
      </el-container>
    </el-main>

    <el-aside
      class="area-drag-col"
      v-resize="{ type: 'right', dom: 'pointDom' }"
    ></el-aside>

    <el-aside width="228px" id="pointDom">
      <el-container>
        <el-main>
          <LayoutPoint :model="model" skin="point"></LayoutPoint>
        </el-main>
        <el-footer
          class="area-drag-row"
          v-resize="{ type: 'bottom', dom: 'pointAttrDom' }"
        ></el-footer>
        <el-footer height="428px" id="pointAttrDom">
          <LayoutPointAttr :model="model"></LayoutPointAttr>
        </el-footer>
      </el-container>
    </el-aside>
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
