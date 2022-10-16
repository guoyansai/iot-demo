import { createApp, toRaw } from 'vue';
import { createPinia, PiniaPluginContext } from 'pinia';

import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css';
import App from './App.vue';

// import io from 'socket.io/client-dist/socket.io';
import { io } from 'socket.io-client';

import MyHead from './components/MyHead.vue';
import { dModel } from './mixins/dModel';

type Option = {
  key?: string;
};
const setStorage = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};
const getStorage = (key: string) => {
  return localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key) as string)
    : {};
};
const __piniaKey__: string = 'asaicc';
const piniaPlugin = (options: Option) => {
  return (context: PiniaPluginContext) => {
    const { store } = context;
    const data = getStorage(`${options?.key ?? __piniaKey__}-${store.$id}`);
    store.$subscribe(() => {
      console.log(666.334, '监听到存储了', toRaw(store.$state));
      setStorage(
        `${options?.key ?? __piniaKey__}-${store.$id}`,
        toRaw(store.$state)
      );
    });
    return { ...data };
  };
};

const pinia = createPinia();
pinia.use(
  piniaPlugin({
    key: 'pinia',
  })
);

const app = createApp(App);

// 挂载全局变量的方法1
const appModel = dModel();
app.config.globalProperties.$appModel = appModel.model;
app.config.globalProperties.$io = io;

// 挂载全局变量的方法2
const appName = { title: 'vue+template', ver: 1 };
declare module 'vue' {
  export interface ComponentCustomProperties {
    $appModel: typeof appModel.model;
    $appName: typeof appName;
    $io: typeof io;
  }
}
app.config.globalProperties.$appName = appName;

app.component('MyHead', MyHead); // 注册全局组件
app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.mount('#app');
