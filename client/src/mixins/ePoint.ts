import { ref, onMounted, onUnmounted, reactive, getCurrentInstance } from 'vue';
import storeaa from '../store';

const storeyy = storeaa();
storeyy.initModel();
// const model = toRef(
//   computed(() => {
//     return storeyy.model.storeIotModel;
//   })
// );
export function ePoint() {
  const globalProperties =
    getCurrentInstance()?.appContext.config.globalProperties;
  const appModel = reactive(globalProperties?.$appModel);
  const x = ref(0);
  const y = ref(0);
  function update(event: { pageX: number; pageY: number }) {
    x.value = event.pageX;
    y.value = event.pageY;
  }
  function setXY() {
    console.log(666.123, appModel);
    // model.test.point = { x: x.value, y: y.value };
    appModel.position.x = x.value;
    appModel.position.y = y.value;
  }

  onMounted(() => window.addEventListener('mousemove', update));
  onMounted(() => window.addEventListener('click', setXY));
  onUnmounted(() => window.removeEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('click', setXY));

  return { x, y };
}
