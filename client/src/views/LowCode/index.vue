<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';
import storePinia from '../../store';

const name: Ref<string> = ref('tt');

const storeP = storePinia();
const { admin, model, user } = storeToRefs(storeP);
storeP.$subscribe((args, state) => {
  console.log(666.123, args, state);
});
const setModel = () => {
  console.log(storeP.storeIotModel);
};

// 只修改某个属性
const changeUserName = (userName: string) => {
  storeP.$patch((storeP) => {
    storeP.user.username = userName;
  });
};
// 使用 $patch 修改数据
const changeUserData = (user: object) => {
  storeP.$patch({
    user,
  });
};
</script>

<template>
  <h1>LowCode</h1>
  <div class="model-test">
    <el-form>
      <el-form-item label="X">
        <el-input-number
          @click.stop
          v-model="$appModel.position.x"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Y">
        <el-input @click.stop v-model="$appModel.position.y"></el-input>
      </el-form-item>
    </el-form>
  </div>

  {{ admin.admin }}
  <el-button @click="admin.addLevel(2)">level+</el-button>
  <el-button @click="admin.setAdmin()">异步更改</el-button>
  <el-button @click="admin.$reset()">重置</el-button>

  <hr />
  {{ storeP.user }}
  <el-input v-model="name" placeholder="请输入名字"></el-input>
  <button @click="changeUserName(name)">change username</button>
  <button
    @click="changeUserData({ username: name, role: storeP.user.role + '1' })"
  >
    change user
  </button>
  <el-button @click="setModel()">赋值</el-button>
  44{{ storeP.title }}33
  <el-button @click="storeP.changeTitle">store action changeTitle</el-button>
</template>
