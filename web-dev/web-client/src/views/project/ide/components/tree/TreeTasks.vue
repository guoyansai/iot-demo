<script setup lang="ts">
import TreePart from './TreePart.vue';
// 引入指令
import vResize from '@/components/v-resize';

const props = defineProps<{
  model: any;
  taskstype: string;
  skin?: string;
}>();

function setDoingCurrent(id: string) {
  console.log(666.2002,props.model)
  props.model.doing.tasks.current = id;
}
</script>

<template>
  <el-container class="as-tasks-area">
    <template
      :key="taskstype + skin + item[taskstype].id"
      v-for="(item, index) in model.tasks"
    >
      <el-main
        v-if="props.model.doing.tasks.main === item.id"
        class="as-tasks"
        :id="taskstype + skin + item[taskstype].id"
        @click="setDoingCurrent(item.id)"
      >
        <TreePart
          :model="model"
          :taskstype="taskstype"
          :skin="skin"
          :tasksid="item.id"
        ></TreePart>
      </el-main>
      <template v-else>
        <el-footer
          class="area-drag-row"
          v-resize="{ type: 'bottom', dom: taskstype + skin + item[taskstype].id }"
        >
        </el-footer>
        <el-footer
          class="as-tasks"
          :id="taskstype + skin + item[taskstype].id"
          @click="setDoingCurrent(item.id)"
        >
          <TreePart
            :model="model"
            :taskstype="taskstype"
            :skin="skin"
            :tasksid="item.id"
          ></TreePart>
        </el-footer>
      </template>
    </template>
  </el-container>
</template>

<style scoped lang="scss">
.as-tasks-area {
  height: 100%;
  display: flex;
  flex-direction: column;
  .as-tasks {
    min-height: 100px;
  }
}

.area-drag-row {
  height: 5px;
  background-color: #e7e6e4;
  cursor: move;
}
</style>
