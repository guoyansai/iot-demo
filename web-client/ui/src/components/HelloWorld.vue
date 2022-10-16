<script setup lang="ts">
import { reactive, toRefs } from 'vue';
import type { todoListData } from '../type/todoList';

defineProps<{ msg: string }>();

const data = reactive<todoListData>({
  title: '',
  list: [],
});

const addFun = () => {
  console.log(data.title);
  data.list.push({
    id: data.list.length + 1,
    title: data.title,
    type: false,
  });
};

const { title, list } = toRefs(data);
</script>

<template>
  <h1>{{ msg }}</h1>
  <div>
    <div>
      <input v-model="title" type="text" placeholder="请输入事项" />
      <el-button @click="addFun">添加</el-button>
    </div>
    <table>
      <tr>
        <td>ID</td>
        <td>标题</td>
        <td>状态</td>
      </tr>
      <tr v-for="item in list" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.title }}</td>
        <td>{{ item.type }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
