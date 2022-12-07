import { DeepClone } from '@/utils/DeepClone';
import { Uuid } from '@/utils/Uuid';
import { ref, toRaw } from 'vue';

export default function (
  skin: string = '',
  model: any,
  tasksid: string,
  taskstype: string
) {
  const treenode = (model.tasks.find((el: any) => el && el.id === tasksid) ||
    {})[taskstype];
  const treeData = treenode;
  const treeconfig = treeData.treeconfig || {};
  const treeType = skin || treeconfig.taskstype;
  treeData.doing = treeData.doing || {};
  if (!treeData.doing.current || !treeData.doing.current.id) {
    treeData.doing.current = doingItemData(treeData);
  }
  const doingItem = treeData.doing;
  let dropType = ref(50);

  // 计算方式获取判断卡片选中状态
  function isCurrent(item: any) {
    let styles: string;
    if (item.showchildren && item.children && item.children.length) {
      styles = 'as-trees-mys';
    } else {
      styles = 'as-trees-my';
    }
    if (item.id === doingItem.current.id) {
      styles += ' as-trees-my-cur';
    } else if (
      doingItem.current?.parents &&
      doingItem.current.parents.length &&
      doingItem.current.parents.includes(item.id)
    ) {
      styles += ' as-trees-my-par';
    } else if (
      item.parents &&
      item.parents.length &&
      item.parents.includes(doingItem.current.id)
    ) {
      styles += ' as-trees-my-chi';
    }
    !doingItem.play && (doingItem.play = {});
    if (item.id === doingItem.play.id) {
      styles += ' as-play';
    }
    return styles;
  }

  // 深度遍历children并更新parents的值
  function dfsChildren(item: any, type: string = '') {
    if (item && item.id && item.children && item.children.length) {
      item.children.forEach((el: any) => {
        if (el) {
          el.parents = [...item.parents, item.id];
          if (type === 'copy') {
            el.id = Uuid(el.id.substring(0, 3));
            el.label += el.label.slice(-3) === ' 复制' ? '' : ' 复制';
          }
          dfsChildren(el, type);
        }
      });
    }
  }
  // 获取父节点
  function getParentItem(item: any) {
    if (item && item.id) {
      let parentItem = treeData;
      if (
        item.parents &&
        item.parents.length &&
        parentItem &&
        parentItem?.children
      ) {
        item.parents.forEach((elp: any) => {
          parentItem =
            parentItem?.children[
              parentItem?.children.findIndex((el: any) => el && el.id === elp)
            ];
        });
      }
      return parentItem;
    }
  }
  // 包装深拷贝
  function deepCopy(item: any) {
    return DeepClone(toRaw(item));
  }
  // 判断当前item是否含子节点
  function checkChildren(item: any) {
    if (item && item.id && item.children && item.children.length) {
      const tmp = item.children.filter((el: any) => el && el.id);
      return tmp && tmp.length;
    }
    return false;
  }
  // 复制出新节点item
  function copyItemData(item: any) {
    const newItem = deepCopy(item);
    newItem.id = Uuid(newItem.id.substring(0, 3));
    newItem.label += newItem.label.slice(-3) === ' 复制' ? '' : ' 复制';
    dfsChildren(newItem, 'copy');
    return newItem;
  }
  // 复制节点
  function copyItem(item: any) {
    const parentItem = getParentItem(item);
    const itemIndex = parentItem?.children.findIndex(
      (el: any) => el && el.id === item.id
    );
    const newItem = copyItemData(item);
    newItem && parentItem?.children.splice(itemIndex + 1, 0, newItem);
    setCurItem(newItem);
  }
  // 获取doing节点的储存数据
  function doingItemData(item: any) {
    return { id: item.id, parents: item.parents };
  }
  // 运行节点
  function playItem(item: any) {
    doingItem.play = doingItemData(item);
  }
  // 是否为主任务
  function isMainTasks() {
    return tasksid === model?.doing?.tasks?.main;
  }
  // 删除当前子任务
  function apiDeleteProject() {
    // 仅支持删除从任务，主任务不可删
    if (!isMainTasks()) {
      setDoingTasksCurrent(0);
      const index = model.tasks.findIndex((el: any) => el.id === tasksid);
      model.tasks.splice(index, 1);
    }
  }
  // 锁定节点
  function locakItem(item: any) {
    console.log(item);
  }
  // 隐藏节点
  function hiddenItem(item: any) {
    console.log(item);
  }
  // Dom上执行命令删除节点:删除当前节点，并将父节点设为当前节点
  function delItem(item: any) {
    deleteItem(item, 1);
    setCurItem(getParentItem(item));
  }
  // 删除指定节点
  function deleteItem(item: any, type: number = 0) {
    if (item && item.id) {
      const parentItem = getParentItem(item);
      const index = parentItem?.children.findIndex(
        (el: any) => el && el.id === item.id && (el.hasDrop || type === 1)
      );
      parentItem?.children.splice(index, 1);
    }
  }
  // 更新选中的子任务id
  function setDoingTasksCurrent(tmp: number = 1) {
    if (tmp === 0) {
      model.doing.tasks.current = model.doing.tasks.main;
    } else {
      model.doing.tasks.current = tasksid;
    }
  }
  // 点击更新选中节点
  function setCurItem(item: any) {
    if (item) {
      setDoingTasksCurrent();
      if (item.id) {
        doingItem.current.id = item.id;
        doingItem.current.parents = item.parents;
      }
    }
  }
  // 更新子任务的所有add
  function setProjectDoingAdd(item: any) {
    model.doing.add = item;
  }
  // 更新子任务的所有drag
  function setProjectDoingDrag(item: any) {
    model.doing.drag = item;
  }
  // 更新drop节点
  function setDropItem(item: any) {
    setDoingTasksCurrent();
    model.doing.drop = item;
  }
  // 点击更新选中节点
  function handleClick(item: any) {
    setCurItem(item);
  }
  // 初始化Dom被drop的时候样式
  function initDom(val: number, item: any, pos: string = 'x') {
    const thisDom: any = document.getElementById(treeType + item.id);
    if (thisDom) {
      if (val > 80) {
        if (pos === 'y') {
          thisDom.style.animation = 'flowbottom 0.5s infinite';
        } else {
          thisDom.style.animation = 'flowright 0.5s infinite';
        }
      } else if (val > 20) {
        thisDom.style.animation = 'flowcenter 0.5s infinite';
      } else if (val > 0) {
        if (pos === 'y') {
          thisDom.style.animation = 'flowtop 0.5s infinite';
        } else {
          thisDom.style.animation = 'flowleft 0.5s infinite';
        }
      } else {
        thisDom.style.animation = '';
      }
    }
  }

  // drop事件
  function handlerDrop(e: any, item: any) {
    e.preventDefault();
    initDom(0, item);
    // let newItem: any = e.dataTransfer.getData('addApp'); // 采用dataTransfer.getData方式传递数据
    // newItem = JSON.parse(newItem);
    let newItem: any = model.doing.add;
    console.log(666.9008, item, newItem);
    if (
      item.id &&
      ((model.doing.drag && item.id !== model.doing.drag.id) || newItem?.id)
    ) {
      if (!newItem?.id) {
        newItem = DeepClone(toRaw(model.doing.drag));
        model.doing.drag.hasDrop = true;
      }

      if ((dropType.value > 20 && dropType.value < 80) || isTreeTop(item)) {
        item.showchildren = true;
        if (isTreeTop(item)) {
          newItem.parents = [];
        } else {
          newItem.parents = [...item.parents, item.id];
        }
        dfsChildren(newItem);
        !item.children && (item.children = []);
        newItem && item.children.push(newItem);
      } else {
        newItem.parents = [...item.parents];
        dfsChildren(newItem);
        const parentItem = getParentItem(item);
        const itemIndex = parentItem?.children.findIndex(
          (el: any) => el && el.id === item.id
        );
        if (newItem) {
          if (dropType.value > 79) {
            parentItem?.children.splice(itemIndex + 1, 0, newItem);
          } else {
            parentItem?.children.splice(itemIndex, 0, newItem);
          }
        }
      }
      setCurItem(newItem);
    }
  }
  // drag元素进入被drop元素时的事件
  function handlerDragenter(e: any, item: any) {
    setDropItem(item);
    e.preventDefault();
  }
  // 离开drop元素的事件
  function handlerDragleave(e: any, item: any) {
    e.preventDefault();
    setDropItem({});
    initDom(0, item);
  }
  // 父不能向子里面拖动
  function isCanDrop(_e: any, item: any, newItem: any) {
    return (
      (model.doing.drag?.id &&
        !item.parents.includes(model.doing.drag.id) &&
        model.doing.drag.id !== item.id) ||
      newItem?.id
    );
  }
  function isTree() {
    return treeType === 'tree' || treeType === 'point';
  }
  function isTreeTop(item: any) {
    return item.type === 'programs' || item.type === 'points';
  }
  function dropPosition(e: any, item: any) {
    if (isTree()) {
      console.log(666.123, e.offsetY, e.target.clientHeight);
      dropType.value = Math.round(
        (100 * e.offsetY) / (e.target.clientHeight || 10)
      );
      initDom(dropType.value, item, 'y');
    } else {
      if (e.target.clientWidth === 9090) {
        dropType.value = 99;
      } else {
        dropType.value = Math.round(
          (100 * e.offsetX) / (e.target.clientWidth || 10)
        );
      }
      initDom(dropType.value, item);
    }
  }
  // 在drop元素上move的时候触发
  function handlerDragover(e: any, item: any) {
    // let newItem: any = e.dataTransfer.getData('addApp');
    let newItem: any = model.doing.add;
    if (isCanDrop(e, item, newItem)) {
      e.preventDefault();
      dropPosition(e, item);
    }
  }

  // 拖拽开始事件
  function handlerDragstart(e: any, item: any) {
    // handleClick(item);
    setProjectDoingDrag(item);
    setProjectDoingAdd({});
    e.target.parentElement.style.opacity = '0.4';
    e.dataTransfer.setDragImage(e.srcElement, 0, 0);
    // e.dataTransfer.effectAllowed = 'move';
    console.log(666.204, e, item);
  }
  // 拖拽结束事件
  function handlerDragend(e: any, item: any) {
    e.target.parentElement.style.opacity = '1';
    // 如果被drop了就删掉
    if (item.hasDrop) {
      deleteItem(item);
    }
    setProjectDoingDrag({});
  }

  return {
    treenode,
    tasksid,
    isMainTasks,
    treeconfig,
    treeType,
    isTree,
    isTreeTop,
    delItem,
    copyItem,
    playItem,
    locakItem,
    hiddenItem,
    isCurrent,
    checkChildren,
    setProjectDoingDrag,
    apiDeleteProject,
    handleClick,
    handlerDrop,
    handlerDragenter,
    handlerDragleave,
    handlerDragover,
    handlerDragstart,
    handlerDragend,
  };
}
