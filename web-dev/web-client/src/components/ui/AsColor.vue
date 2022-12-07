<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
  modelValue: {
    type: String,
    default: '#009fa822',
  },
});

let newVal = ref(props.modelValue);
const emit = defineEmits(['update:modelValue']);

const predefineColors = ref([
  '#009fa811',
  '#009fa833',
  '#009fa855',
  '#009fa877',
  '#009fa8',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
]);

function activeChange(val: string) {
  emit('update:modelValue', val);
}
</script>

<template>
  <el-color-picker
    v-model="newVal"
    show-alpha
    :predefine="predefineColors"
    @active-change="activeChange"
  />
</template>

<style scoped lang="scss"></style>
