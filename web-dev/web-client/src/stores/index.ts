import { toStr } from '@/utils/Json';
import { createPinia, type PiniaPluginContext } from 'pinia'; // 引入pinia
import { toRaw } from 'vue';
const pinia = createPinia(); // 创建

// 定义缓存管理用的配置数据类型
interface IStorageOption {
  key: string;
  keeps: {
    sessions: string[];
    locals: string[];
  };
}
// 缓存配置数据
const storageOption: IStorageOption = {
  key: '__pinia__', //缓存名key的前置字符串
  keeps: {
    sessions: [], // 采用seesionStorage缓存的key
    locals: ['model', 'model00411'], // 采用localStorage缓存的key
  },
};
// 储存pinia的值
function setStorage(
  key: string,
  val: any,
  storageType: Storage = localStorage
) {
  const obj = { v: val };
  console.log(666.789, key);
  storageType.setItem(storageOption.key + key, toStr(obj));
}
// 从缓存中获取pinia的值
function getStorage(key: string, storageType: Storage = localStorage) {
  const val = storageType.getItem(storageOption.key + key);
  const obj = val ? JSON.parse(val as string) : null;
  return obj?.v || null;
}
// 依据配置项综合处理缓存的读写
function doStorage(
  key: string,
  store: any,
  storageType: Storage = localStorage
) {
  const storageResult = getStorage(key, storageType);
  if (storageResult) {
    console.log(666.7007, '读取啦', storageResult, key, toRaw(store.$state));
    store.$patch(() => {
      store.$state = { ...storageResult };
    });
  }
  store.$subscribe(() => {
    console.log(666.7002, '更新啦', key, toRaw(store.$state));
    setStorage(key, toRaw(store.$state), storageType);
  });
}
// 处理pinia缓存需要的中间件
function useStorage() {
  return (ctx: PiniaPluginContext) => {
    const { store } = ctx;
    const sid = store.$id;
    if (storageOption.keeps.locals.includes(sid)) {
      doStorage(sid, store, localStorage);
    } else if (storageOption.keeps.sessions.includes(sid)) {
      doStorage(sid, store, sessionStorage);
    }
  };
}

pinia.use(useStorage());

export default pinia;
