<script setup lang="ts">
import { ref } from 'vue';
import Attr from './Attr.vue';

const props = defineProps<{
  node: any;
  mixintree: any;
}>();
const {
  isMainTasks,
  treeconfig,
  delItem,
  copyItem,
  playItem,
  handleClick,
  isCurrent,
  apiDeleteProject,
} = props.mixintree;

let visible = ref(false);
</script>
<template>
  <el-popover
    :visible="visible && isCurrent(node).includes('-cur')"
    :width="treeconfig.wa"
  >
    <template #reference>
      <el-icon
        @click.stop="
          visible = !visible;
          handleClick(node);
        "
        ><Setting
      /></el-icon>
    </template>
    <div class="as-attr">
      <div class="as-attr-tit">
        <span>{{ node.label }}</span>
        <div
          v-if="
            (node.type === 'programs' || node.type === 'points') &&
            !isMainTasks()
          "
        >
          <el-popconfirm title="请确认删除子任务操作？" @confirm="apiDeleteProject()">
            <template #reference>
              <el-icon><Delete /></el-icon>
            </template>
          </el-popconfirm>
        </div>
        <div v-if="node.type !== 'programs' && node.type !== 'points'">
          <el-popconfirm title="请确认操作？" @confirm="delItem(node)">
            <template #reference>
              <el-icon><Delete /></el-icon>
            </template>
          </el-popconfirm>
          <el-icon @click.stop="copyItem(node)">
            <CopyDocument />
          </el-icon>
          <el-icon @click.stop="playItem(node)">
            <VideoPlay />
          </el-icon>
        </div>
      </div>
      <el-scrollbar :height="treeconfig.ha">
        <Attr :node="node"></Attr>
      </el-scrollbar>
    </div>
  </el-popover>
</template>

<style scoped lang="scss">
.as-attr {
  .as-attr-tit {
    border-bottom: #68686833 1px solid;
    display: flex;
    padding: 5px 12px;
    span {
      display: block;
      font-weight: bold;
      flex-grow: 1;
      text-align: left;
    }
    div {
      display: block;
      width: 100px;
      text-align: right;
      .el-icon {
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
}
</style>
