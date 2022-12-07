import { createApp } from 'vue';

// 引入element-plus
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 主题样式封装在这个scss文件中
import './assets/main.scss';

import App from './App.vue';
import router from './router';

import pinia from './stores';

const app = createApp(App);

// 这里挂载到Vue3中，支持设置默认尺寸的，浮动zIndex的值
app.use(ElementPlus, { size: 'small', zIndex: 2022 });

// 挂载Element-plus的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(pinia);

app.use(router);

app.mount('#app');
