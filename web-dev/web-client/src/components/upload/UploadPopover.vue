<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';
const props = defineProps({
  config: {
    type: Object,
  },
  data: {
    type: Object,
  },
});
const data: any = computed(() => props.data);

const config = computed(() =>
  Object.assign(
    {
      accept: '.jpg,.jepg,.png,.gif,.estun',
      limit: 30,
      maxSize: 1024 * 1024 * 2,
      upType: 'text', // picture
    },
    props.config || {}
  )
).value;
const upload = ref();

function handleBeforeUpload(file: any) {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.'));
  const whiteList = config.accept.split(',');
  if (whiteList.indexOf(fileSuffix.toLowerCase()) === -1) {
    ElMessage.error('文件格式不符合');
    return false;
  }
  if (file.size > config.maxSize) {
    ElMessage.error('文件大小不符合');
    return false;
  }
  return true;
}

function httpRequest(options: any) {
  const { file } = options;
  data.value.list.push({ uid: file.uid, name: file.name, size: file.size });

  const reader = new FileReader();

  if (config.upType === 'picture') {
    reader.readAsDataURL(file);
  } else {
    reader.readAsText(file);
  }

  reader.onload = () => {
    console.log(666.1003, reader.result);
    const fileItem = data.value.list.find((el: any) => el.uid === file.uid);

    if (config.upType === 'picture') {
      dealImage(reader.result, 500, (resData: any) => {
        fileItem.data = resData;
      });
    } else {
      fileItem.data = reader.result;
    }

    ElMessage({
      message: fileItem.name + '已加入上传队列！',
      type: 'success',
    });
    upload.value.clearFiles();
  };

  reader.onerror = (err: any) => {
    ElMessage.error(err);
  };
}

function del(index: number) {
  data.value.list.splice(index, 1);
}

// 仅前端使用
function dealImage(base64: any, max: number, callback: any) {
  const newImage = new Image();
  const quality = 0.8; // 压缩系数0-1之间
  newImage.src = base64;
  newImage.setAttribute('crossOrigin', 'Anonymous'); // url为外域时需要
  newImage.onload = () => {
    const imgWidth: number = newImage.width;
    const imgHeight: number = newImage.height;
    const canvas: any = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');
    if (Math.max(imgWidth, imgHeight) > max) {
      if (imgWidth > imgHeight) {
        canvas.width = max;
        canvas.height = (max * imgHeight) / imgWidth;
      } else {
        canvas.height = max;
        canvas.width = (max * imgWidth) / imgHeight;
      }
    } else {
      canvas.width = imgWidth;
      canvas.height = imgHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height);

    // 必须通过回调函数返回，否则无法及时拿到该值
    callback(canvas.toDataURL('image/jpeg', quality));
  };
}
</script>
<template>
  <el-upload
    ref="upload"
    action="#"
    :http-request="httpRequest"
    :before-upload="handleBeforeUpload"
    :limit="config.limit"
    :accept="config.accept"
    :show-file-list="false"
    drag
    multiple
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      拖拽文件到这里 或 <em>点击选择上传文件</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        仅支持上传
        <strong>{{ config.accept }}</strong>
        格式的文件，且文件大小不大于
        <strong>{{ Math.round(config.maxSize / 1024) }}</strong>
        KB
      </div>
    </template>
  </el-upload>
  <template v-if="data.list && data.list.length">
    <el-row class="up-list up-list-bar">
      <el-col :span="2" class="up-list-index">序号</el-col>
      <template v-if="config.upType === 'picture'">
        <el-col :span="4" class="up-list-pic">预览图</el-col>
        <el-col :span="10" class="nowrap">文件名</el-col>
      </template>
      <el-col v-else :span="14" class="nowrap">文件名</el-col>
      <el-col :span="6">大小</el-col>
      <el-col :span="2" class="up-list-opt">操作</el-col>
    </el-row>
    <el-row class="up-list" v-for="(item, index) in data.list">
      <el-col :span="2" class="up-list-index">{{ index + 1 }}</el-col>
      <template v-if="config.upType === 'picture'">
        <el-col :span="4" class="up-list-pic">
          <img :src="item.data" />
        </el-col>
        <el-col :span="10" class="up-list-title nowrap" :title="item.name">
          {{ item.name }}
        </el-col>
      </template>
      <el-col v-else :span="14" class="up-list-title nowrap" :title="item.name">
        {{ item.name }}
      </el-col>
      <el-col :span="6" class="up-list-size">{{ item.size }}</el-col>
      <el-col :span="2" class="up-list-opt">
        <el-popconfirm title="确定要删除吗？" @confirm="del(index)">
          <template #reference>
            <el-icon><delete /></el-icon>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>
  </template>
</template>

<style scoped lang="scss">
.up-list {
  padding: 0 6px;
  &.up-list-bar,
  &:hover {
    background-color: #f5f5f5;
  }
  .up-list-index {
    text-align: center;
  }
  .up-list-pic {
    text-align: center;
    img {
      max-width: 100%;
      max-height: 38px;
    }
  }
  .up-list-title {
    color: #282828;
    padding: 0 6px;
  }
  .up-list-size {
    color: #989898;
  }
  .up-list-opt {
    text-align: center;
  }
}
</style>
