import { defineStore } from 'pinia';
import { DeepClone } from '@/utils/DeepClone';

// 默认的初始化数据引入
const modelStoreTmp = {
  type: 1,
  data: {
    val: 3,
    item: { a: 1, b: 2 },
  },
};

export default defineStore('propstry', {
  state: () => {
    return {
      modelStore: DeepClone(modelStoreTmp),
    };
  },
  actions: {},
});
