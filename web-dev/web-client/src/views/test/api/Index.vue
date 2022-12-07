<script setup lang="ts">
import Api from '@/utils/Api';
import Data from './Data.vue';
import Sqlite from './Sqlite.vue';
import Mysql from './Mysql.vue';
import { ref } from 'vue';

let resHtml = ref('');
function getHtml(url: string) {
  url = url ?? '/home/index';
  Api({
    url,
    method: 'GET',
  }).then((res: any) => {
    resHtml.value = res;
    console.log(666.999, res);
  });
}
const apiWhiteLists = [
  '/home/index',
  '/home/try',
  '/page/api',
  '/page/404',
  '/page/helloworld',
  '/file/write',
  '/file/delete',
  '/file/read',
  '/file/list',
];
</script>

<template>
  <div style="padding: 12px">
    <h1>API</h1>
    <el-button
      v-for="item in apiWhiteLists"
      :key="item"
      type="primary"
      @click="getHtml(item)"
    >
      获取数据{{ item }}
    </el-button>
    <div v-html="resHtml"></div>
    <div>
      <pre>{{ resHtml }}</pre>
    </div>
    <h1>MySQL增删改查</h1>
    <Mysql></Mysql>
    <h1>SQLite增删改查</h1>
    <Sqlite></Sqlite>
    <h1>File增删改查</h1>
    <Data></Data>
  </div>
</template>

<style scoped lang="scss"></style>
