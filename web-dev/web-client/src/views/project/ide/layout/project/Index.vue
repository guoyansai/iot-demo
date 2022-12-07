<script setup lang="ts">
import ProjectMixin from '../../components/model/ProjectMixin';
import UploadIndex from '@/components/upload/Index.vue';
import { reactive } from 'vue';
import UpLoad from '@/components/upload/api/UpLoad';

const props = defineProps<{
  model: any;
}>();

const {
  projectsData,
  apiProjectListData,
  goProject,
  apiDeleteProject,
  apiSaveProject,
  apiCopyProject,
  downProject,
  newProject,
  addCopyTask,
  handlerDragstart,
  handlerDragend,
} = ProjectMixin(props.model);

apiProjectListData();

const config = {
  accept: '.estun',
  limit: 30,
  maxSize: 1024 * 1024 * 2,
  upType: 'text', // picture
};
const data = reactive({ list: [] });
function upLoadSubmit() {
  if (config.upType === 'picture') {
    data.list.forEach((el: any) => {
      UpLoad.upLoadPicture(el);
    });
  } else {
    data.list.forEach((el: any) => {
      console.log(666.999888, el);
      apiCopyProject(JSON.parse(el.data), ' 导入');
    });
    apiProjectListData();
  }
}
</script>

<template>
  <el-container class="as-area">
    <el-header class="as-area-tit">
      <el-row>
        <el-col :span="8">工程管理</el-col>
        <el-col :span="16" class="as-area-opt">
          <el-icon @click="newProject()">
            <Plus />
          </el-icon>
          <el-icon @click="apiSaveProject()">
            <Sell />
          </el-icon>
          <UploadIndex
            :config="config"
            :data="data"
            @upLoadSubmit="upLoadSubmit"
          ></UploadIndex>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class="as-project-area">
        <el-row
          v-if="projectsData.item && projectsData.item.length"
          v-for="item in projectsData.item"
          :title="item.file"
          class="as-project"
          :class="model.id === item.content.id ? 'as-project-cur' : ''"
        >
          <el-col
            :span="16"
            class="as-project-title"
            @click="goProject(item.content.id)"
            >{{ item.content.label }}</el-col
          >
          <el-col :span="8" class="as-project-opt">
            <el-icon @click="downProject(item)"><Download /></el-icon>
            <el-icon @click="apiCopyProject(item.content, ' 复制')">
              <DocumentCopy />
            </el-icon>
            <el-popconfirm
              title="不可撤销操作，请确认删除工程操作？"
              @confirm="apiDeleteProject(item.content.id)"
            >
              <template #reference>
                <el-icon><Close /></el-icon>
              </template>
            </el-popconfirm>
          </el-col>
          <el-col
            :span="24"
            class="as-task"
            v-for="(itemTask, index) in item.content.tasks"
          >
            <el-row class="as-task-parent">
              <el-col :span="16" class="as-task-tit">
                <el-icon><TakeawayBox /></el-icon>
                {{ itemTask.label || `任务${index + 1}` }}
              </el-col>
              <el-col :span="8" class="as-task-opt">
                <el-icon @click="addCopyTask(itemTask)"><Plus /></el-icon>
              </el-col>
            </el-row>
            <div
              class="as-task-item"
              v-for="itemKey in ['programs', 'points']"
              draggable="true"
              @dragstart="handlerDragstart($event, itemTask[itemKey])"
              @dragend="handlerDragend($event, itemTask[itemKey])"
            >
              <el-icon><Tickets /></el-icon> {{ itemTask[itemKey].label }}
            </div>
          </el-col>
        </el-row>
        <el-empty v-else>
          <el-button type="primary" @click="newProject()">新建工程</el-button>
        </el-empty>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.as-project-area {
  border-top: 1px solid #d8d8d8;
  .as-project:nth-child(odd) {
    background-color: #f5f5f5;
  }
  .as-project {
    border-bottom: 1px solid #d8d8d8;
    &:hover {
      background-color: #f0f0f0;
    }
    .as-project-title {
      cursor: pointer;
      width: auto;
      color: #282828;
      line-height: 32px;
      padding: 0 8px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .as-project-opt {
      line-height: 32px;
      padding-right: 8px;
      text-align: right;
    }
    .as-project-opt,
    .as-task-opt {
      .el-icon {
        cursor: pointer;
        background-color: #98989828;
        color: #282828;
        border-radius: 50%;
        font-size: 10px;
        padding: 3px;
        margin-left: 5px;
      }
    }
    .as-task {
      border-top: #d8d8d8 1px dashed;
      font-size: small;
      .as-task-parent {
        color: #686868;
        line-height: 28px;
        .as-task-tit {
          padding-left: 10px;
          width: auto;
          height: auto;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .as-task-opt {
          padding-right: 8px;
          text-align: right;
        }
      }
      .as-task-item {
        color: #989898;
        cursor: move;
        line-height: 22px;
        padding-left: 20px;
        &:hover {
          background-color: azure;
        }
      }
    }
  }
}

.as-project-cur {
  .as-project-title {
    font-weight: bold;
  }
}
</style>
