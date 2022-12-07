import { DeepClone } from '@/utils/DeepClone';
import { Uuid } from '@/utils/Uuid';
import { toRaw } from 'vue';
import configProject from '../../config/config-project.json';
import configTree from '../../config/config-tree.json';

export default (model: any) => {
  const taskCurrentId =
    model?.doing?.tasks?.current || model?.doing?.tasks?.main;
  // 当前在做的任务
  let taskCurrent =
    model.tasks && model.tasks.find((el: any) => el && el.id === taskCurrentId);
  if (!taskCurrent) {
    if (model.tasks) {
      taskCurrent = model.tasks[0];
      model.doing.tasks.current = taskCurrent.id;
      model.doing.tasks.main = taskCurrent.id;
    } else {
      taskCurrent = {};
    }
  }

  // 当前在做的程序
  const taskCurrentPrograms = taskCurrent.programs;
  // 当前在做的点集
  const taskCurrentPoints = taskCurrent.points;

  // 设置添加数据
  function setProjectDoingAdd(item: any) {
    model.doing.add = item;
  }
  // 设置拖拽数据
  function setProjectDoingDrag(item: any) {
    model.doing.drag = item;
  }

  // 获取doing节点
  function getTaskDoingCurrent(
    taskstype: string = 'programs',
    doingType: string = 'current'
  ) {
    let currentItem: any;
    const data = taskCurrent[taskstype]?.doing[doingType];
    if (!data.parents) {
      currentItem = taskCurrent[taskstype];
    } else if (!data.parents.length) {
      currentItem = taskCurrent[taskstype].children.find(
        (el: any) => el && el.id === data.id
      );
    } else {
      let node = taskCurrent[taskstype];
      if (node) {
        data.parents.forEach((elp: any) => {
          node = node?.children.find((elc: any) => elc && elc.id === elp);
        });
        currentItem =
          node?.children.find((el: any) => el && el.id === data.id) || {};
      }
    }
    if (!currentItem?.id) {
      return taskCurrent[taskstype];
    }
    return currentItem;
  }

  // 新建一个任务数据
  function newTask() {
    const programs = DeepClone(configProject.programs);
    programs.id = Uuid('pr');
    const points = DeepClone(configProject.points);
    points.id = Uuid('po');
    const task = DeepClone(configProject.task);
    task.id = Uuid('tk');
    Object.assign(
      programs.treeconfig,
      configTree.style[programs.treeconfig.type]
    );
    Object.assign(points.treeconfig, configTree.style[points.treeconfig.type]);
    Object.assign(task, { programs, points });
    return task;
  }
  // 添加一个任务
  function addTask() {
    model.tasks.push(newTask());
  }
  // 删除一个任务
  function deleteTask(index: number) {
    model.tasks.splice(index, 0);
  }

  // 新建一个工程模型数据
  function newProjectData() {
    const TaskData = DeepClone(configProject.project);
    const newProjectData = newTask();
    TaskData.tasks.push(newProjectData);
    TaskData.id = Uuid('ta');
    TaskData.doing.tasks.main = newProjectData.id;
    TaskData.doing.tasks.current = newProjectData.id;
    return DeepClone(TaskData);
  }

  // 初始化模型
  function initProject(itemProject: any = model) {
    if (itemProject?.doing) {
      if (!itemProject.doing.tasks.main) {
        itemProject.doing.tasks.main = itemProject.tasks[0].id;
      }
      if (!itemProject.doing.tasks.current) {
        itemProject.doing.tasks.current = itemProject.tasks[0].id;
      }
    }
  }

  // 保存工程前的数据处理，消除模型中循环引用
  function formatProject(itemProject: any = model) {
    const rawModel = DeepClone(toRaw(itemProject));
    initProject(rawModel);
    rawModel.doing = DeepClone(configProject.project.doing);
    if (rawModel.tasks)
      rawModel.tasks.forEach((el: any) => {
        ['programs', 'points'].forEach((elc: string) => {
          // 规整tree样式
          el[elc].treeconfig = {
            ...configTree.style[el[elc].treeconfig.type],
            ...el[elc].treeconfig,
          };
          // 深度清除children中的null
          el[elc].children = cleanChildren(el[elc].children);
        });
      });
    return rawModel;
  }

  // 深度清除children中的null
  function cleanChildren(arr: any[]) {
    return arr.filter((el: any) => {
      if (el && el.children && el.children.length) {
        el.children = cleanChildren(el.children);
      }
      return !!el;
    });
  }

  // 替换上新的工程数据
  function replaceProject(res: any) {
    Object.keys(res).forEach((el: any) => {
      model[el] = res[el];
    });
  }
  // 复制一个新的工程
  function copyProjectData(obj: any, copyStr: string) {
    const copynewProjectData = DeepClone(obj);
    copynewProjectData.id = Uuid('ta');
    copynewProjectData.label += copyAddStr(copynewProjectData.label, copyStr);
    copynewProjectData.tasks.forEach((el: any) => {
      el.id = Uuid('tk');
      el.programs.id = Uuid('pr');
      el.programs.label += copyAddStr(el.programs.label, copyStr);
      el.points.id = Uuid('po');
      el.points.label += copyAddStr(el.points.label, copyStr);
    });
    return copynewProjectData;
  }
  // 复制重命名处理
  function copyAddStr(oldStr: string, str: string) {
    return oldStr.slice(0 - str.length) === str ? '' : str;
  }

  return {
    model,
    taskCurrentPrograms,
    taskCurrentPoints,
    setProjectDoingAdd,
    setProjectDoingDrag,
    getTaskDoingCurrent,
    initProject,
    newProjectData,
    formatProject,
    replaceProject,
    copyProjectData,
    addTask,
    deleteTask,
  };
};
