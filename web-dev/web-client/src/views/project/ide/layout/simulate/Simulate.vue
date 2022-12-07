<script setup>
import Simulate from './Index.vue';
import { onMounted, provide, reactive } from 'vue';
import axios from 'axios';

/***************************************************************************************************************************
 * 生命周期
 * ************************************************************************************************************************/
onMounted(() => {
  getDatas();
});

/***************************************************************************************************************************
 * 变量 申明设置
 * ************************************************************************************************************************/
let config;
let sendData = reactive({});
provide('sendData', sendData);

/***************************************************************************************************************************
 * 方法 申明设置
 * ************************************************************************************************************************/
/***********
 * 模型数据请求
 */
async function getDatas() {
  //获取模型对应的配置数据
  var pathUrl = '/model/';
  var jsonUrl = pathUrl + '5kg-6axis-demo-model.json';
  var traceUrl = pathUrl + 'demo-trace.json';
  await axios.get(jsonUrl).then((data) => {
    config = data.data;
    //实际是获取模型路径数据
    config.modelPath = pathUrl + config.fileName;
    sendData.config = config;
  });
  //获取可视化编程后的小球轨迹数据
  await axios.get(traceUrl).then((data) => {
    sendData.visualTrace = data.data;
  });
}
</script>

<template>
  <div class="as-simulate-area">
    <Simulate></Simulate>
  </div>
</template>

<style scoped lang="scss">
.as-simulate-area {
  width: 100%;
  height: 100%;
  // min-width: 1680px;
  // min-height: 900px;
  // background-color: #2d3748;
  padding: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  :deep(.action_list) {
    display: none;
    left: auto;
    right: 50px;
    top: 50px;
  }
  :deep(.home_button_box) {
    position: absolute;
  }
  :deep(.container) {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
