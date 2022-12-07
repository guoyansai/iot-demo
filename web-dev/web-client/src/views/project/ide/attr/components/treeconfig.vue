<script setup lang="ts">
import InputDefault from './main/InputDefault.vue';
const props = defineProps<{
  node: any;
  labels: any;
}>();

const key = 'treeconfig';
const comLists = Object.keys(props.node[key]);
</script>
<template>
  <div class="as-attr-title">{{ labels[key].lang }}</div>
  <InputDefault
    v-for="item in comLists"
    :node="node[key]"
    :labels="labels[key].label"
    :keyName="item"
  />
</template>

<style scoped lang="scss"></style>
