<script setup lang="ts">
import Tree from './Tree.vue';
import TreePartMixin from './TreePartMixin';
import AttrPopover from '../../attr/AttrPopover.vue';
import { computed } from 'vue';

const props = defineProps<{
  model: any;
  taskstype: string;
  skin?: string;
  tasksid: string;
}>();
const treePart = computed(() => {
  const mixintree = TreePartMixin(
    props.skin,
    props.model,
    props.tasksid,
    props.taskstype
  );
  const { handleClick, treenode, isTree, handlerDrop, handlerDragover } =
    mixintree;
  return {
    handleClick,
    treenode,
    isTree,
    handlerDrop,
    handlerDragover,
    mixintree,
  };
});
</script>

<template>
  <el-container
    class="as-tree-part"
    v-if="treePart.treenode?.id"
    @click.stop="treePart.handleClick(treePart.treenode)"
    @drop.stop="treePart.handlerDrop($event, treePart.treenode)"
    @dragover.stop.native="treePart.handlerDragover($event, treePart.treenode)"
  >
    <el-main>
      <div :class="`as-tree-show${treePart.isTree() ? '-tree' : ''}`">
        <Tree
          :mixintree="treePart.mixintree"
          :treenode="treePart.treenode.children"
        ></Tree>
      </div>
    </el-main>
    <div class="as-tree-setting">
      <AttrPopover
        :node="treePart.treenode"
        :mixintree="treePart.mixintree"
      ></AttrPopover>
    </div>
  </el-container>
</template>

<style scoped lang="scss">
.as-tree-part {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background-image: repeating-linear-gradient(
      0deg,
      #f0e7f4 0 0.5px,
      transparent 0.5px 20px
    ),
    repeating-linear-gradient(90deg, #f0e7f4 0 0.5px, transparent 0.5px 20px);
  .as-tree-show,
  .as-tree-show-tree {
    padding: 5px 12px;
    width: fit-content;
    overflow: hidden;
    // background-color: antiquewhite;
  }

  .as-tree-show-tree {
    min-width: calc(100% - 24px);
  }
  .as-tree-setting {
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
</style>
