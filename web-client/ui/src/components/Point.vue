<script setup lang="ts"></script>

<template>
  <div
    class="point"
    :style="{
      top: `${$appModel.position.y}px`,
      left: `${$appModel.position.x}px`,
    }"
  ></div>
</template>

<style scoped>
.point {
  background-color: aqua;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  margin-top: -10px;
  border-radius: 50%;
  position: absolute;
}
</style>
