<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
let newVal = ref(props.modelValue);
const emit = defineEmits(['update:modelValue']);

function onChange(val: boolean) {
  emit('update:modelValue', val);
}
</script>

<template>
  <el-switch v-model="newVal" @change="onChange" />
</template>

<style scoped lang="scss"></style>
