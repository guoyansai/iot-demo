import { defineStore } from 'pinia';
import { DeepClone } from '@/utils/DeepClone';

// 默认的初始化数据引入
import { modelInitTemp } from '../config/model';

export default defineStore('model006', {
  state: () => {
    return {
      model: DeepClone(modelInitTemp),
    };
  },
  actions: {},
});
