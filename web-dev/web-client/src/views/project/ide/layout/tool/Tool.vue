<script setup lang="ts">
import TreeNodeMixin from '../../components/treenode/TreeNodeMixin';

const props = defineProps<{
  model: any;
  tool: any;
}>();

const { addNode, handlerDragstart, handlerDragend } = TreeNodeMixin(
  props.model,
  'programs'
);
</script>
<template>
  <div class="as-tool-area">
    <div
      class="as-tool"
      v-for="itemClass in tool.children"
      :key="itemClass.type"
    >
      <div class="as-tool-tit">{{ itemClass.label }}</div>
      <div class="as-tool-main">
        <div
          v-for="item in itemClass.children"
          :key="item.type"
          class="as-tool-item"
          draggable="true"
          @dragstart="handlerDragstart($event, item)"
          @dragend="handlerDragend($event, item)"
          @click="addNode(item)"
        >
          <div class="as-tool-img" :style="item.style">
            <el-icon><component :is="item.ico" /></el-icon>
          </div>
          <div class="as-tool-label">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.as-tool-area {
  .as-tool {
    .as-tool-tit {
      background-color: #f6f6f6;
      padding: 5px 12px;
      margin-bottom: 5px;
    }
    .as-tool-main {
      width: 100%;
      min-width: 66px;
      .as-tool-item {
        height: 86px;
        overflow: hidden;
        border-radius: 10px;
        display: inline-block;
        text-align: center;
        cursor: pointer;

        &:hover {
          background-color: #66666611;
          .as-tool-img {
            color: #666666;
          }
        }
        .as-tool-img {
          border-radius: 5px;
          display: inline-block;
          text-align: center;
          color: #ffffff;
          box-shadow: 1px 1px 1px #d8d8d8;
          border: 1px solid #d8d8d8;
          background-color: #ffffff;
          margin: 5px;
          width: 38px;
          height: 38px;
          line-height: 38px;
          .el-icon {
            font-size: 28px;
            margin-top: 5px;
          }
        }
        .as-tool-label {
          text-align: center;
          color: #282828;
          font-size: small;
          width: 58px;
          padding-bottom: 5px;
        }
      }
    }
  }
}
</style>
