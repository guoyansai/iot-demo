<script setup lang="ts">
import { inject, ref, Ref } from 'vue';

let globalFlag = inject<Ref<number>>('globalFlag', ref(1));
</script>

<template>
  <div>BBBBB</div>
  {{ globalFlag }}
</template>

<style scoped></style>
