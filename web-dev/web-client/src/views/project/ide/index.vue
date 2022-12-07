<script setup lang="ts">
import { computed, defineAsyncComponent, provide, watch } from 'vue';
import router from '@/router';
import ProjectMixin from './components/model/ProjectMixin';

// 引入Pinia的状态管理模块
import storeModel from './stores/model';

// 定义模块名；定义需要取出的数据名。
const Model = storeModel();
const model = Model.model;
// 从这里提供model
provide('model', model);

const { apiProjectData } = ProjectMixin(model);

// 通过url中参数变化重新加载模型
watch(
  () => router.currentRoute.value.params.sn,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      apiProjectData((newVal as string) || '');
    }
  },
  {
    immediate: true,
  }
);

// 这里使用计算属性是为了同步子组件中的更改
const programCom = computed(() => {
  const m = model.customconfig.page;
  return defineAsyncComponent(() => import(`./index/${m}.vue`));
});
</script>

<template>
  <component :is="programCom" :model="model"></component>
</template>

<style scoped lang="scss"></style>
