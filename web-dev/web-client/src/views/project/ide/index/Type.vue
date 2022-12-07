<script setup lang="ts">
import configTree from '../config/config-tree.json';
import Attr from '../attr/Attr.vue';

import ModelMixin from '../components/model/ModelMixin';

const props = defineProps<{
  model: any;
}>();

const { addTask } = ModelMixin(props.model);

function setType(type: string) {
  props.model.customconfig.page = type;
}
</script>

<template>
  <el-popover trigger="click" placement="top" :width="228">
    <Attr :node="model"></Attr>
    <div>
      <el-button
        v-for="item in Object.keys(configTree.page)"
        :key="item"
        @click="setType(item)"
        :title="configTree.page[item]"
      >
        {{ configTree.page[item] }}
      </el-button>

      <el-button type="primary" @click="addTask()">新增子任务</el-button>
    </div>

    <template #reference>
      <el-icon><Help /></el-icon>
    </template>
  </el-popover>
</template>

<style scoped lang="scss">
.el-button {
  margin: 6px 3px;
  cursor: pointer;
}
</style>
