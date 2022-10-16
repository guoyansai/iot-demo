import { reactive } from 'vue';
// import { $ } from 'vue/macros';

export function dModel() {
  const modelTemplate = {
    position: { x: 0, y: 0 },
    title: 'model-vue+template',
    ver: 1,
    index: 1,
  };

  const model = reactive(modelTemplate);
  // const { title, ver, index } = $(model); // 将对象解构成ref
  // let model = reactive({
  //   get() {
  //     console.log(666.002, 'model');
  //     return modelTemplate;
  //   },
  //   set(newVal: any) {
  //     console.log(666.001, newVal);
  //     model = newVal;
  //   },
  // });

  return { model };
}
