<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import UploadPopover from './UploadPopover.vue';
import apiUpLoad from './api/UpLoad';

const props = defineProps({
  config: {
    type: Object,
  },
  data: {
    type: Object,
  },
});
const emit = defineEmits(['upLoadSubmit']);
const data: any = computed(() => props.data);

const dialogVisible = ref(false);
const config = Object.assign(
  {
    accept: '.jpg,.jepg,.png,.gif,.estun',
    limit: 30,
    maxSize: 1024 * 1024 * 2,
    upType: 'text', // picture
  },
  props.config
);
function upLoad() {
  console.log(666.3003, data.value.list);
  if (config.upType === 'picture') {
    data.value.list.forEach((el: any) => {
      apiUpLoad
        .upLoadPicture(el)
        .then((res: any) => {
          console.log(666.90087, res);
          el.stat = 2;
        })
        .catch((_err: any) => {
          el.stat = 1;
        });
    });
  }
  emit('upLoadSubmit');

  dialogVisible.value = false;
}
</script>
<template>
  <span class="as-dialog">
    <el-icon @click="dialogVisible = true"><upload-filled /></el-icon>
    <el-dialog
      :close-on-click-modal="false"
      v-model="dialogVisible"
      title="文件上传"
      width="30%"
      draggable
    >
      <span>
        <UploadPopover :config="config" :data="data"></UploadPopover>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消上传</el-button>
          <el-button type="primary" @click="upLoad"> 确定上传 </el-button>
        </span>
      </template>
    </el-dialog>
  </span>
</template>

<style scoped lang="scss">
.as-dialog {
  text-align: left;
}
</style>
