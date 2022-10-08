<script setup lang="ts">
import { reactive, toRefs, computed, getCurrentInstance } from 'vue';
import type { todoListData } from '../../type/todoList';

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
const login = (str: string) => {
  localStorage.setItem('token', str);
};

const globalProperties =
  getCurrentInstance()?.appContext.config.globalProperties;
const appModel = reactive(globalProperties?.$appModel);
const positonStr = computed({
  get() {
    return JSON.stringify(appModel.position);
  },
  set(val) {
    // 这里要如何处理数据兼容？假如遇上val不是对象
    let obj = JSON.parse(val || '{}');
    if (obj.x && obj.y) {
      appModel.position = obj;
    }
  },
});
const { title, list } = toRefs(data);
</script>

<template>
  <h1>Editor</h1>
  <div class="model-test">
    <el-button @click.stop="$appModel.position.x++">X+1</el-button>
    <el-button @click.stop="$appModel.position.x--">X-1</el-button>
    <el-button @click.stop="$appModel.position.y++">Y+1</el-button>
    <el-button @click.stop="$appModel.position.y--">Y-1</el-button>
    <el-input @click.stop type="text" v-model="positonStr"></el-input>
  </div>
  <router-link to="/test">去测试页面</router-link>
  <router-link replace to="/test">去测试页面（无历史记录）</router-link>
  <el-button @click="login('asai')">登录</el-button>
  <el-button @click="login('')">退出登录被路由守卫拦截</el-button>
  <div>
    <div>
      <input v-model="title" type="text" placeholder="请输入事项" />
      <button @click="addFun">添加</button>
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
  {{ $appModel }}
  <el-input v-model="$appModel.ver" />
  <el-button @click="$appModel.ver++">2全局变量加1-处理全局model方案</el-button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
