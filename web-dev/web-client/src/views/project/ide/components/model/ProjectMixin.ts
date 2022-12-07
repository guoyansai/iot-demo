import router from '@/router';
import apiProject from '../../api/Project';
import { DeepClone } from '@/utils/DeepClone';
import { Uuid } from '@/utils/Uuid';
import { reactive } from 'vue';
import ModelMixin from './ModelMixin';
import As from '@/utils/As';

export default function (model: any) {
  // 共用模型混入
  const {
    initProject,
    newProjectData,
    formatProject,
    copyProjectData,
    replaceProject,
    setProjectDoingAdd,
    setProjectDoingDrag,
  } = ModelMixin(model);
  // 定义临时变量
  const projectsData: any = reactive({ item: {} });
  // 获取工程列表
  function apiProjectListData() {
    apiProject.list().then((res: any) => {
      projectsData.item = res.reverse();
      projectsData.item.forEach((el: any) => {
        el.content = As.jsonParse(el.content);
      });
    });
  }
  // 读取某工程
  function apiProjectData(id: string) {
    apiProject.read(id).then((res: any) => {
      const readVal: any = As.jsonParse(res[0].content);
      if (model.id !== readVal.id) {
        replaceProject(formatProject(readVal));
      }
    });
  }
  // 删除某工程
  function apiDeleteProject(id: string) {
    apiProject.del(id).then((res: any) => {
      console.log(res);
      apiProjectListData();
      if (router.currentRoute.value.params.sn === id) {
        newProject();
      }
    });
  }
  // 保存某工程
  function apiSaveProject() {
    if (router.currentRoute.value.params.sn === model.id) {
      apiProject.edit(formatProject(model)).then((res: any) => {
        console.log(res);
        apiProjectListData();
      });
    } else {
      apiProject.add(formatProject(model)).then((res: any) => {
        console.log(res);
        apiProjectListData();
        router.replace('/' + model.id);
      });
    }
  }
  // 复制某工程
  function apiCopyProject(item: any, copyStr: string) {
    const newProgram = copyProjectData(item, copyStr);
    apiProject.add(newProgram).then((res: any) => {
      console.log(res);
      router.push('/' + newProgram.id);
    });
  }

  // 路由跳转到指定工程
  function goProject(id: string) {
    router.push('/' + id);
  }
  // 下载某工程
  function downProject(item: any) {
    console.log(666.9005,item)
    const elink = document.createElement('a');
    elink.style.display = 'none';
    // elink.href = 'data:text/plain;base64,' + item.content;
    elink.href =
      'data:text/plain;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(item.content));
    elink.setAttribute('download', item.name);
    document.body.appendChild(elink);
    setTimeout(() => {
      elink.click();
      document.body.removeChild(elink);
    }, 66);
  }

  // 加载新工程
  function newProject() {
    replaceProject(newProjectData());
    router.replace('/');
  }
  // 添加工程中的任务到当前工程中
  function addCopyTask(item: any) {
    const taskItem = DeepClone(item);
    taskItem.id = Uuid('tk');
    ['programs', 'points'].forEach((el: any) => {
      newCopyNode(taskItem[el]);
    });
    model.tasks.push(taskItem);
  }
  // 深度替换复制节点的id
  function newCopyNode(item: any) {
    if (item) {
      model.uuid++;
      if (item.children && item.children.length) {
        item.children.forEach((el: any) => {
          newCopyNode(el);
        });
      }
      item.id = Uuid(item.id.slice(0, 3));
    }
  }
  // 拖拽开始，按新增控件方式处理节点
  function handlerDragstart(_e: any, item: any) {
    const nodeItem = DeepClone(item);
    nodeItem.type = 'group' + nodeItem.type;
    nodeItem.ico = 'Tickets';
    delete nodeItem.doing;
    delete nodeItem.treeconfig;
    newCopyNode(nodeItem);
    console.log(666.123, nodeItem, item);
    setProjectDoingAdd(nodeItem);
    setProjectDoingDrag({});
  }
  // 拖拽结束后清空add
  function handlerDragend(_e: any, _item: any) {
    setProjectDoingAdd({});
  }

  return {
    initProject,
    projectsData,
    apiProjectListData,
    goProject,
    apiProjectData,
    apiDeleteProject,
    apiSaveProject,
    apiCopyProject,
    downProject,
    newProject,
    addCopyTask,
    handlerDragstart,
    handlerDragend,
  };
}
