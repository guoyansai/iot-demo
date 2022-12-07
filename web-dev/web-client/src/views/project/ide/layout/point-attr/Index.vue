<script setup lang="ts">
import { computed } from 'vue';
import Attr from '../../attr/Attr.vue';
import ModelMixin from '../../components/model/ModelMixin';

const props = defineProps<{
  model: any;
}>();

const currentItem = computed(() => {
  const { getTaskDoingCurrent } = ModelMixin(props.model);
  return getTaskDoingCurrent('points');
});
</script>
<template>
  <el-container class="as-area bg">
    <el-header class="as-area-tit">
      点属性-{{ currentItem && currentItem.label }}
    </el-header>
    <el-main class="as-area-main">
      <Attr :node="currentItem"></Attr>
    </el-main>
  </el-container>
  
</template>

<style scoped lang="scss"></style>
