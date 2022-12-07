<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { io } from 'socket.io-client'; // 引入ws客户端插件
const ws = io('ws://127.0.0.1:9098'); // 建立与服务器端的ws服务

const sliderValue = ref(0);

// 初始化ws服务
function wsInit() {
  // 监听到我连接到了ws服务
  ws.on('connect', () => {
    console.log(666.601, 'connect');
  });
}

const msgClient = ref(''); // 储存我的消息
function emitMsgClient(msg: string) {
  // 向服务器端发送我的消息
  ws.emit('msg-client', msg);
}
function emitMsgFetch(msg: string) {
  // 携带我的消息向服务器端请求，同上
  ws.emit('msg-fetch', msg);
}

const msgServer = ref('');
function onMsgServer() {
  //监听从服务器端回传的消息
  ws.on('msg-server', (res, callback) => {
    console.log(666.601, 'msg-server', res);
    msgServer.value = res.tm + ':' + res.msg;
    // 只有到服务器端有第三个回调函数时，才能回应这个callback消息
    callback(new Date() + ' 客户端获取了该消息');
  });
}

const msgIndex = ref('');
function onMsgIndex() {
  // 监听服务端实时心跳来的消息
  ws.on('msg-index', (res) => {
    console.log(666.601, 'msg-index', res);
    msgIndex.value = res;
    sliderValue.value = res % 100;
  });
}

const msgFetch = reactive({ userLists: [] });
const msgBroadcastUsers = reactive({ userLists: [] });
const msgBroadcast: string[] = reactive([]);
function onMsgFetch() {
  // 监听服务器发过来的消息
  ws.on('msg-fetch-server', (res) => {
    console.log(666.601, 'msg-fetch-server', res);
    msgFetch.userLists = res.fetch;
  });
  ws.on('msg-broadcast', (res: any) => {
    console.log(666.601, 'msg-broadcast', res);
    msgBroadcast.push(res.msg);
    msgBroadcastUsers.userLists = res.users;
  });
}

onMounted(() => {
  wsInit();
  onMsgServer();
  onMsgIndex();
  onMsgFetch();
});
</script>

<template>
  <div style="padding: 20px">
    <h1 style="text-align: center">Web平台前端与后端WS通信预研</h1>
    <el-row>
      <el-col :span="2"></el-col>
      <el-col :span="20">
        <h4>实时通信示例：{{ msgIndex }}</h4>
        <div>从服务器中获取到的实时数字计时，每个web页显示一致，同步更新。</div>
        <el-slider v-model="sliderValue" />
        <el-progress
          :text-inside="true"
          :stroke-width="22"
          :percentage="sliderValue"
          status="warning"
        />
      </el-col>
    </el-row>
    <div style="padding: 20px">
      <el-row>
        <el-col :span="16">
          <el-form :inline="true" size="medium">
            <el-form-item label="消息内容">
              <el-input
                v-model="msgClient"
                placeholder="请输入发送的消息"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click.stop="emitMsgClient(msgClient)"
                >发送消息给服务器</el-button
              >
            </el-form-item>
          </el-form>
          <el-alert
            :closable="false"
            :title="`从服务器获得消息：`"
            type="success"
            :description="`消息内容：${msgServer ? msgServer : 'null'}`"
            show-icon
          />
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="6">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <span
                >被动fetch消息：{{ msgBroadcastUsers.userLists.length }}</span
              >
            </div>
          </template>
          <div v-for="(item, index) in msgBroadcastUsers.userLists" :key="item">
            {{ index + 1 }}、{{ item }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="8">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <span>动态广播：{{ msgBroadcast.length }}</span>
            </div>
          </template>
          <div v-for="(item, index) in msgBroadcast" :key="item">
            {{ index + 1 }}、{{ item }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="8">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <span>主动fetch消息：{{ msgFetch.userLists.length }}</span>
              <el-button class="button" text
                ><el-button @click.stop="emitMsgFetch(msgClient)"
                  >fetch消息</el-button
                ></el-button
              >
            </div>
          </template>
          <div v-for="(item, index) in msgFetch.userLists" :key="item">
            {{ index + 1 }}、{{ item }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss"></style>
