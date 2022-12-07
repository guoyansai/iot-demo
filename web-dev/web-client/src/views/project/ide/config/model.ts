import configTasks from './config-tasks-temp.json';
import ModelMixin from '../components/model/ModelMixin';

export const modelInitTemp = (() => {
  const { newProjectData } = ModelMixin({});
  const TaskData = newProjectData();
  Object.assign(TaskData.tasks[0].programs, configTasks.programs);
  Object.assign(TaskData.tasks[0].points, configTasks.points);
  return TaskData;
})();
