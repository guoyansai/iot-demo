<script setup lang="ts">
import TreeTasks from '../../components/tree/TreeTasks.vue';
import configPoints from '../../config/config-points.json';
import TreeNodeMixin from '../../components/treenode/TreeNodeMixin';

const props = defineProps<{
  model: any;
  skin?: string;
}>();

const { addNode, handlerDragstart, handlerDragend } = TreeNodeMixin(
  props.model,
  'points'
);
</script>

<template>
  <el-container class="as-area">
    <el-header class="as-area-tit">
      <el-row>
        <el-col :span="12">点编辑</el-col>
        <el-col :span="12" class="as-area-opt">
          <el-icon
            v-for="item in configPoints.children[0].children"
            draggable="true"
            @dragstart="handlerDragstart($event, item)"
            @dragend="handlerDragend($event, item)"
            @click="addNode(item)"
          >
            <Plus />
          </el-icon>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="as-area-main">
      <TreeTasks :model="model" taskstype="points" :skin="skin"></TreeTasks>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.as-area {
  position: relative;
  .tree-setting {
    position: absolute;
    bottom: 8px;
    right: 8px;
    cursor: pointer;
    :deep(.el-icon) {
      font-size: 20px;
      color: #898989;
    }
  }
}
.as-area-content {
  background: radial-gradient(circle, #a5a5a5 0.5px, transparent 0.5px);
  background-size: 10px 10px;
}
</style>
