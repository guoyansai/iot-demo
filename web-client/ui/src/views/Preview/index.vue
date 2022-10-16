<script setup lang="ts">
import {
  reactive,
  markRaw,
  inject,
  Ref,
  ref,
  onMounted,
  getCurrentInstance,
} from 'vue';
import A from './com/A.vue';
import B from './com/B.vue';
import C from './com/C.vue';
import Point from '../../components/Point.vue';
import { ePoint } from '../../mixins/ePoint';

import opt1 from './charts/multipleLines';
import * as echarts from 'echarts';

import storePinia from '../../store';
const showTeleport: Ref<boolean> = ref(true);
const storeP = storePinia();

const { proxy } = getCurrentInstance() as any;

let globalFlag = inject<Ref<number>>('globalFlag');
type Tabs = {
  name: string;
  comName: any;
};
type Com = Pick<Tabs, 'comName'>;
const { x, y } = ePoint();
const data = reactive<Tabs[]>([
  {
    name: '我是A组件',
    comName: markRaw(A),
  },
  {
    name: '我是B组件',
    comName: markRaw(B),
  },
  {
    name: '我是C组件',
    comName: markRaw(C),
  },
]);
const current: Tabs = reactive<Tabs>({
  name: '我是A组件',
  comName: markRaw(A),
});
const setCurrent = (item: Tabs) => {
  current.comName = item.comName;
};

const data1 = reactive({
  time: ['1', '2'],
  voltage: [380, 370],
  current: [100, 110],
});
const data2: any[] = reactive([]);
const panel = ref();
const $echarts = echarts;

const io = proxy.$io();
// const io = proxy.$io('ws://127.0.0.1:9098');
const ioServerCount = ref(1);
const ioServerMsg = ref('');

function sendMsg(msg: string) {
  ioServerCount.value++;
  const sendIo = io;
  // const sendIo = io.connect('ws://127.0.0.1:9098');
  console.log(666.333, sendIo, ioServerCount.value + ': ' + msg);
  sendIo.emit('msg-client', ioServerCount.value + ': ' + msg);
}

onMounted(() => {
  const myChart1 = $echarts.init(panel.value);
  myChart1.setOption(opt1(data1));

  io.on('connect', () => {
    console.log('connect');
  });

  io.on('msg-server', (msg: { msg: string }) => {
    ioServerMsg.value = msg.msg;
  });

  io.on('msg', (data: any) => {
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
    // console.log(data2)
  });
});
</script>

<template>
  <h1>Preview</h1>
  <div class="model-test">
    <h4>x=({{ $appModel.position.x }}) y=({{ $appModel.position.y }})</h4>
    Mouse position is at: {{ x }}, {{ y }}
  </div>
  <el-button @click="showTeleport = !showTeleport"
    >关闭鼠标点击图形化</el-button
  >

  {{ globalFlag
  }}<el-button @click="globalFlag = (globalFlag || 0) + 1">加上1</el-button>
  <el-button
    v-for="(item, index) in data"
    :key="index"
    type="primary"
    @click="setCurrent(item)"
    >{{ item.name }}</el-button
  >
  <component :is="current.comName"></component>
  <teleport to="body" v-if="showTeleport">
    <Point></Point>
  </teleport>
  <h1>物联网交互ws示例</h1>
  <div style="background: #ffff00">
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

<style scoped>
#panel {
  width: 400px;
  height: 300px;
}
#panel2 {
  width: 400px;
  height: 300px;
}
#panel2 p {
  display: block;
  border: solid 1px #003366;
  margin: 0;
}
#panel2 p span {
  display: block;
}
</style>
