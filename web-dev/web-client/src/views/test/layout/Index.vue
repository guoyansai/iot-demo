<script setup lang="ts">
function handlerDrop(e: any, item: any) {
  console.log(666.001, 'handlerDrop', e, item);
}
function handlerDragenter(e: any, item: any) {
  console.log(666.002, 'handlerDragenter', e, item);
}
function handlerDragleave(e: any, item: any) {
  console.log(666.003, 'handlerDragleave', e, item);
}
function handlerDragover(e: any, item: any) {
  e.preventDefault();
  console.log(666.004, 'handlerDragover', e, item);
}
function handlerDragstart(e: any, item: any) {
  console.log(666.005, 'handlerDragstart', e, item);
}
function handlerDragend(e: any, item: any) {
  console.log(666.006, 'handlerDragend', e, item);
}
function handleClick(item: any) {
  console.log(666.007, 'handleClick', item);
}
</script>

<template>
  <div class="ak">
    <el-row
      draggable="true"
      @drop.stop="handlerDrop($event, 0)"
      @dragenter.stop="handlerDragenter($event, 0)"
      @dragleave="handlerDragleave($event, 0)"
      @dragover.stop.native="handlerDragover($event, 0)"
      @dragstart="handlerDragstart($event, 0)"
      @dragend="handlerDragend($event, 0)"
      @click.stop="handleClick(0)"
    >
      <el-col
        v-for="item in 10"
        draggable="true"
        @drop.stop="handlerDrop($event, item)"
        @dragenter.stop="handlerDragenter($event, item)"
        @dragleave="handlerDragleave($event, item)"
        @dragover.stop.native="handlerDragover($event, item)"
        @dragstart="handlerDragstart($event, item)"
        @dragend="handlerDragend($event, item)"
        @click.stop="handleClick(item)"
        :span="item"
      >
        {{ item }}
        <div class="ec">h{{ item }}</div>
      </el-col>
      <el-col :span="6">22</el-col>
      <el-col :span="6">44</el-col>
    </el-row>
  </div>
</template>
<style scoped lang="scss">
.ak{
  padding: 20px;
}
.el-row {
  background-color: #f5f5f5;
  width: 100%;
  overflow: hidden;
}
.el-col {
  background-color: antiquewhite;
  min-height: 100px;
  margin: 5px;
  position: relative;
  display: flex;
  .ec {
    position: absolute;
    top: 0;
    right: -2000px;
    background-color: #ffff00;
    width: 2000px;
    height: 100%;
  }
}
</style>
