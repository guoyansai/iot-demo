<script setup lang="ts">
import Api from '@/utils/Api';
import As from '@/utils/As';
import { reactive, ref } from 'vue';
const types = [
  { label: '一星', value: 1 },
  { label: '二星', value: 2 },
  { label: '三星', value: 3 },
];
const lists: any = ref([]);

const itemData: any = reactive({
  data: { id: '123', title: '标题1', content: '内容1', type: 1 },
});

const activeNames = ref(['1']);
const handleChange = (val: string[]) => {
  console.log(val);
};
function add() {
  Api({
    url: '/apifiletest/add',
    method: 'POST',
    data: itemData.data,
  }).then((res: any) => {
    console.log(666.999, res);
    getLists();
  });
}
function del(item: any) {
  Api({
    url: '/apifiletest/del',
    method: 'GET',
    params: { id: item.id },
  }).then((res: any) => {
    console.log(666.999, res);
    getLists();
  });
}
function read(item: any) {
  Api({
    url: '/apifiletest/read',
    method: 'GET',
    params: { id: item.id },
  }).then((res: any) => {
    itemData.data = As.jsonParse(res?.data[0].content);
    console.log(666.999, res);
  });
}
function edit() {
  Api({
    url: '/apifiletest/edit',
    method: 'POST',
    data: itemData.data,
  }).then((res: any) => {
    console.log(666.999, res);
    getLists();
  });
}
function getLists() {
  Api({
    url: '/apifiletest/list',
    method: 'GET',
  }).then((res: any) => {
    lists.value = res.data;
    lists.value.forEach((el: any) => {
      el.content = As.jsonParse(el.content);
    });
    console.log(666.999, lists.value);
  });
}
getLists();
</script>

<template>
  <el-form label-width="120px"
    >{{ itemData.data }}
    <el-form-item label="编号">
      <el-input v-model="itemData.data.id" />
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="itemData.data.title" />
    </el-form-item>
    <el-form-item label="类型">
      <el-select v-model="itemData.data.type" placeholder="选择类型">
        <el-option
          v-for="item in types"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-model="itemData.data.content" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="add()"> 新增 </el-button>
      <el-button @click="edit()"> 提交 </el-button>
    </el-form-item>
  </el-form>

  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item
      v-for="(item, index) in lists"
      :title="item.content.title"
      :name="index"
    >
      <div>
        <el-button type="primary" @click="del(item.content)"> 删除 </el-button>
        <el-button type="primary" @click="read(item.content)"> 编辑 </el-button>
        {{ item.content.content }}
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped lang="scss"></style>
