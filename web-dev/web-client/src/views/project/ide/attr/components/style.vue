<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps<{
  node: any;
  labels: any;
}>();

const key = 'style';

const componentsLists: any = ['color', 'backgroundColor'];

const nodeKeysLists: any = Object.keys(props.node[key]);

const filterLists: any = componentsLists.filter((item: any) =>
  nodeKeysLists.includes(item)
);

const comLists = computed(() => {
  return filterLists.map((m: any) => {
    return defineAsyncComponent(() => import(`./${key}/${m}.vue`));
  });
});
</script>
<template>
  <div class="as-attr-title">{{ labels[key].lang }}</div>
  <component
    v-for="item in comLists"
    :is="item"
    :node="node[key]"
    :labels="labels[key].label"
  ></component>
</template>

<style scoped lang="scss"></style>
