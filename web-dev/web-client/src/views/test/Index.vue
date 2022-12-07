<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router';

const activeName = ref(router.currentRoute.value.fullPath);
console.log(666.1001, router);
const $router: any = router;
const handleClick = (tab: any, event: Event) => {
  console.log(666.999, tab, event);
  router.push(tab.props.name);
};
</script>

<template>
  <div class="test-area">
    <div class="test-menu">
      <el-tabs
        v-model="activeName"
        type="card"
        class="iot-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in $router.options.routes[0].children[1].children"
          :key="item.name"
          :name="`/test/${item.path}`"
          :label="item?.meta?.title"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="test-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.test-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  .test-menu {
    height: 41px;
  }
  .test-main {
    flex-grow: 1;
  }
}
.iot-tabs {
  margin-top: -1px;
  height: 41px;
  .el-tabs__content {
    padding: 32px;
    font-size: 32px;
    font-weight: 600;
  }
}
</style>
