<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import configAttr from './config/config-attr.json';

const props = defineProps<{
  node: any;
}>();

const componentsLists: any = Object.keys(configAttr.label);
const lang: string = 'zh';
const labels: any = {};
componentsLists.forEach((el: any) => {
  labels[el] = { lang: configAttr.label[el][lang] };
  if (configAttr.label[el].label) {
    labels[el].label = {};
    Object.keys(configAttr.label[el].label).forEach((elc: any) => {
      labels[el].label[elc] = {
        lang: configAttr.label[el].label[elc][lang],
      };
    });
  }
});

const comLists = computed(() => {
  return componentsLists
    .filter((item: any) => Object.keys(props.node || {}).includes(item))
    .map((m: any) => {
      return defineAsyncComponent(() => import(`./components/${m}.vue`));
    });
});
</script>
<template>
  <el-form label-position="right" label-width="98px" class="as-attr">
    <component
      v-for="item in comLists"
      :is="item"
      :node="node"
      :labels="labels"
    ></component>
  </el-form>
</template>

<style scoped lang="scss"></style>
