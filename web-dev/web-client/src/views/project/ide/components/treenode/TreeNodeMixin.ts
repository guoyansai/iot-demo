import { DeepClone } from '@/utils/DeepClone';
import { Uuid } from '@/utils/Uuid';
import { computed } from 'vue';
import ModelMixin from '../model/ModelMixin';

export default function (model: any, taskstype: string) {
  const { setProjectDoingAdd, setProjectDoingDrag } = ModelMixin(model);

  const currentItem = computed(() => {
    const { getTaskDoingCurrent } = ModelMixin(model);
    return getTaskDoingCurrent(taskstype);
  });

  function newNode(item: any) {
    model.uuid++;
    const modelTemp: any = DeepClone(item);
    modelTemp.id = Uuid('k' + modelTemp.id);
    modelTemp.label += model.uuid;
    modelTemp.path += model.uuid;
    modelTemp.parents = [];
    return modelTemp;
  }

  function addNode(item: any) {
    const newChild = newNode(item);
    if (currentItem.value.type && currentItem.value.type !== taskstype) {
      newChild.parents = [
        ...(currentItem.value.parents || []),
        currentItem.value.id,
      ];
    }
    if (!currentItem?.value?.children) {
      currentItem.value.children = [];
    }
    currentItem.value.showchildren = true;
    newChild && currentItem.value.children.push(newChild);
    // // 焦点跳转到新增节点上
    // currentItem = currentItem.value.children.find(
    //   (el: any) => el.id === newChild.id
    // );
  }
  function handlerDragstart(e: any, item: any) {
    // const newChild = newNode(item.type);
    // e.dataTransfer.setData('addApp', JSON.stringify(newChild));
    setProjectDoingAdd(newNode(item));
    setProjectDoingDrag({});
    console.log(666.1001, e, item);
  }
  function handlerDragend(e: any, item: any) {
    // e.dataTransfer.clearData();
    setProjectDoingAdd({});
    console.log(666.10101, e, item);
  }
  return { newNode, addNode, handlerDragstart, handlerDragend };
}
