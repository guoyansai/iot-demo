<script setup lang="ts">
import opt1 from './charts/multipleLines';
import * as echarts from 'echarts';

import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import axios from 'axios';

import { io } from 'socket.io-client';
const socket = io('ws://127.0.0.1:9098');
const data1 = reactive({
  time: ['1', '2'],
  voltage: [380, 370],
  current: [100, 110],
});
const indexstr = ref('');
const data2: any[] = reactive([]);
const panel = ref();
const $echarts = echarts;

const ioServerCount = ref(1);
const ioServerMsg = ref('');

function sendMsg(msg: string) {
  ioServerCount.value++;
  console.log(666.333, ioServerCount.value + ': ' + msg);
  socket.emit('msg-client', ioServerCount.value + ': ' + msg);
}

onMounted(() => {
  const myChart1 = $echarts.init(panel.value);
  myChart1.setOption(opt1(data1));

  socket.on('connect', () => {
    console.log('connect');
  });

  socket.on('msg-server', (msg: { msg: string }, callback) => {
    ioServerMsg.value = msg.msg;
    callback('got it');
  });

  socket.on('msg-index', (msg: string) => {
    indexstr.value = msg;
  });

  socket.on('msg', (data: any) => {
    data1.time.push(data.voltage.update);
    data1.voltage.push(data.voltage.value);
    data1.current.push(data.current.value);

    if (data1.time.length > 5) {
      data1.time.shift();
      data1.voltage.shift();
      data1.current.shift();
    }

    myChart1.setOption(opt1(data1));

    data2.push(data);
    if (data2.length > 5) {
      data2.shift();
    }
  });
});

const apimsg = ref('');
async function apiMsg(type: number) {
  // apimsg.value = await axios.get('http://127.0.0.1:3333/page/helloworld');
  // apimsg.value = await axios.get('http://127.0.0.1:3333/users/login');
  if (type === 1) {
    apimsg.value = await axios.get('http://127.0.0.1:9098/users');
  } else if (type === 2) {
    apimsg.value = await axios.post('http://127.0.0.1:9098/users');
  } else if (type === 3) {
    apimsg.value = await axios.post('http://127.0.0.1:9098/socket.io');
  } else if (type === 4) {
    apimsg.value = await axios.post('http://127.0.0.1:9098/');
  }
}
</script>

<template>
  <h1>Socket.IO预研{{ indexstr }}</h1>
  <el-button @click.stop="apiMsg(1)">API1</el-button>
  <el-button @click.stop="apiMsg(2)">API2</el-button>
  <el-button @click.stop="apiMsg(3)">API3</el-button>
  <el-button @click.stop="apiMsg(4)">API4</el-button>
  {{ apimsg }}
  <div class="dangger">aaa</div>
  <div class="bg">
    <div id="panel" ref="panel"></div>
    <div ref="panel2" id="panel2">
      <p v-for="(item, index) in data2" :key="index">
        <!-- {{item}} -->
        <span>{{ new Date(item.voltage.update) }}</span>
        {{ item.voltage.des }}:{{ item.voltage.value }}
        {{ item.current.des }}:{{ item.current.value }} {{ item.speed.des }}:{{
          item.speed.value
        }}
        <!-- {{item.voltage.des}}:{{item.voltage.value}} -->
      </p>
    </div>
  </div>
  ---123
  <div>
    <el-button @click.stop="sendMsg('发送消息1')" type="primary">
      发送消息1
    </el-button>
    <el-button @click.stop="sendMsg('test1')">test1</el-button>
    接收的服务器消息：{{ ioServerMsg }}
  </div>
</template>

<style scoped lang="scss">
.bg {
  background-color: bisque;
}
#panel {
  width: 400px;
  height: 300px;
}
#panel2 {
  width: 400px;
  height: 300px;
  p {
    display: block;
    border: solid 1px #003366;
    margin: 0;
    span {
      display: block;
    }
  }
}
</style>
<script setup lang="ts">
import opt1 from './charts/multipleLines';
import * as echarts from 'echarts';

import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import axios from 'axios';

import { io } from 'socket.io-client';
const socket = io('ws://127.0.0.1:9098');
const data1 = reactive({
  time: ['1', '2'],
  voltage: [380, 370],
  current: [100, 110],
});
const indexstr = ref('');
const data2: any[] = reactive([]);
const panel = ref();
const $echarts = echarts;

const ioServerCount = ref(1);
const ioServerMsg = ref('');

function sendMsg(msg: string) {
  ioServerCount.value++;
  console.log(666.333, ioServerCount.value + ': ' + msg);
  socket.emit('msg-client', ioServerCount.value + ': ' + msg);
}

onMounted(() => {
  const myChart1 = $echarts.init(panel.value);
  myChart1.setOption(opt1(data1));

  socket.on('connect', () => {
    console.log('connect');
  });

  socket.on('msg-server', (msg: { msg: string }, callback) => {
    ioServerMsg.value = msg.msg;
    callback('got it');
  });

  socket.on('msg-index', (msg: string) => {
    indexstr.value = msg;
  });

  socket.on('msg', (data: any) => {
    data1.time.push(data.voltage.update);
    data1.voltage.push(data.voltage.value);
    data1.current.push(data.current.value);

    if (data1.time.length > 5) {
      data1.time.shift();
      data1.voltage.shift();
      data1.current.shift();
    }

    myChart1.setOption(opt1(data1));

    data2.push(data);
    if (data2.length > 5) {
      data2.shift();
    }
  });
});

const apimsg = ref('');
async function apiMsg(type: number) {
  // apimsg.value = await axios.get('http://127.0.0.1:3333/page/helloworld');
  // apimsg.value = await axios.get('http://127.0.0.1:3333/users/login');
  if (type === 1) {
    apimsg.value = await axios.get('http://127.0.0.1:9098/users');
  } else if (type === 2) {
    apimsg.value = await axios.post('http://127.0.0.1:9098/users');
  } else if (type === 3) {
    apimsg.value = await axios.post('http://127.0.0.1:9098/socket.io');
  } else if (type === 4) {
    apimsg.value = await axios.post('http://127.0.0.1:9098/');
  }
}
</script>

<template>
  <h1>Socket.IO预研{{ indexstr }}</h1>
  <el-button @click.stop="apiMsg(1)">API1</el-button>
  <el-button @click.stop="apiMsg(2)">API2</el-button>
  <el-button @click.stop="apiMsg(3)">API3</el-button>
  <el-button @click.stop="apiMsg(4)">API4</el-button>
  {{ apimsg }}
  <div class="dangger">aaa</div>
  <div class="bg">
    <div id="panel" ref="panel"></div>
    <div ref="panel2" id="panel2">
      <p v-for="(item, index) in data2" :key="index">
        <!-- {{item}} -->
        <span>{{ new Date(item.voltage.update) }}</span>
        {{ item.voltage.des }}:{{ item.voltage.value }}
        {{ item.current.des }}:{{ item.current.value }} {{ item.speed.des }}:{{
          item.speed.value
        }}
        <!-- {{item.voltage.des}}:{{item.voltage.value}} -->
      </p>
    </div>
  </div>
  ---123
  <div>
    <el-button @click.stop="sendMsg('发送消息1')" type="primary">
      发送消息1
    </el-button>
    <el-button @click.stop="sendMsg('test1')">test1</el-button>
    接收的服务器消息：{{ ioServerMsg }}
  </div>
</template>

<style scoped lang="scss">
.bg {
  background-color: bisque;
}
#panel {
  width: 400px;
  height: 300px;
}
#panel2 {
  width: 400px;
  height: 300px;
  p {
    display: block;
    border: solid 1px #003366;
    margin: 0;
    span {
      display: block;
    }
  }
}
</style>
<script setup lang="ts">
import opt1 from './charts/multipleLines';
import * as echarts from 'echarts';

import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import axios from 'axios';

import { io } from 'socket.io-client';
const socket = io('ws://127.0.0.1:9098');
const data1 = reactive({
  time: ['1', '2'],
  voltage: [380, 370],
  current: [100, 110],
});
const indexstr = ref('');
const data2: any[] = reactive([]);
const panel = ref();
const $echarts = echarts;

const ioServerCount = ref(1);
const ioServerMsg = ref('');

function sendMsg(msg: string) {
  ioServerCount.value++;
  console.log(666.333, ioServerCount.value + ': ' + msg);
  socket.emit('msg-client', ioServerCount.value + ': ' + msg);
}

onMounted(() => {
  const myChart1 = $echarts.init(panel.value);
  myChart1.setOption(opt1(data1));

  socket.on('connect', () => {
    console.log('connect');
  });

  socket.on('msg-server', (msg: { msg: string }, callback) => {
    ioServerMsg.value = msg.msg;
    callback('got it');
  });

  socket.on('msg-index', (msg: string) => {
    indexstr.value = msg;
  });

  socket.on('msg', (data: any) => {
    data1.time.push(data.voltage.update);
    data1.voltage.push(data.voltage.value);
    data1.current.push(data.current.value);

    if (data1.time.length > 5) {
      data1.time.shift();
      data1.voltage.shift();
      data1.current.shift();
    }

    myChart1.setOption(opt1(data1));

    data2.push(data);
    if (data2.length > 5) {
      data2.shift();
    }
  });
});

const apimsg = ref('');
async function apiMsg(type: number) {
  // apimsg.value = await axios.get('http://127.0.0.1:3333/page/helloworld');
  // apimsg.value = await axios.get('http://127.0.0.1:3333/users/login');
  if (type === 1) {
    apimsg.value = await axios.get('http://127.0.0.1:9098/users');
  } else if (type === 2) {
    apimsg.value = await axios.post('http://127.0.0.1:9098/users');
  } else if (type === 3) {
    apimsg.value = await axios.post('http://127.0.0.1:9098/socket.io');
  } else if (type === 4) {
    apimsg.value = await axios.post('http://127.0.0.1:9098/');
  }
}
</script>

<template>
  <h1>Socket.IO预研{{ indexstr }}</h1>
  <el-button @click.stop="apiMsg(1)">API1</el-button>
  <el-button @click.stop="apiMsg(2)">API2</el-button>
  <el-button @click.stop="apiMsg(3)">API3</el-button>
  <el-button @click.stop="apiMsg(4)">API4</el-button>
  {{ apimsg }}
  <div class="dangger">aaa</div>
  <div class="bg">
    <div id="panel" ref="panel"></div>
    <div ref="panel2" id="panel2">
      <p v-for="(item, index) in data2" :key="index">
        <!-- {{item}} -->
        <span>{{ new Date(item.voltage.update) }}</span>
        {{ item.voltage.des }}:{{ item.voltage.value }}
        {{ item.current.des }}:{{ item.current.value }} {{ item.speed.des }}:{{
          item.speed.value
        }}
        <!-- {{item.voltage.des}}:{{item.voltage.value}} -->
      </p>
    </div>
  </div>
  ---123
  <div>
    <el-button @click.stop="sendMsg('发送消息1')" type="primary">
      发送消息1
    </el-button>
    <el-button @click.stop="sendMsg('test1')">test1</el-button>
    接收的服务器消息：{{ ioServerMsg }}
  </div>
</template>

<style scoped lang="scss">
.bg {
  background-color: bisque;
}
#panel {
  width: 400px;
  height: 300px;
}
#panel2 {
  width: 400px;
  height: 300px;
  p {
    display: block;
    border: solid 1px #003366;
    margin: 0;
    span {
      display: block;
    }
  }
}
</style>
