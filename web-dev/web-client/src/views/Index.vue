<script lang="ts" setup>
import router from '../router';
import { clearLocal } from '../utils/Clear';

const logo = '/img/logo.png';
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const $router: any = router;
console.log(666.999, router.options,router.options.routes[0].children);
</script>

<template>
  <div class="common-layout">
    <el-container class="common-container">
      <el-header>
        <el-menu
          router
          :default-active="$route.path"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          @select="handleSelect"
        >
          <el-menu-item index="/">
            <el-image class="logo" :src="logo" />
          </el-menu-item>
          <div class="flex-grow" />
          <el-menu-item index="/ui">UI首页</el-menu-item>
          <el-sub-menu index="/iot">
            <template #title>功能预研模块</template>
            <el-sub-menu index="/ui">
              <template #title>历史版本预览</template>
              <el-menu-item
                v-for="item in $router.options.routes[0].children[0].children"
                :key="item.name"
                :index="`/${item.path}`"
              >
                {{ item?.meta?.title }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item
              v-for="item in $router.options.routes[0].children[1].children"
              :key="item.name"
              :index="`/test/${item.path}`"
            >
              {{ item?.meta?.title }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>

      <el-footer>
        <div class="footer">
          尾部的一些信息@2022 比如版权 联系方式等
          <el-button link @click="clearLocal"> 清理缓存 </el-button>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<style scoped lang="scss">
.logo {
  :deep(.el-image__inner) {
    height: 28px;
    margin-bottom: 10px;
  }
}
.flex-grow {
  flex-grow: 1;
}
.el-header,
.el-footer {
  background-color: #f5f5f5;
}
.el-link {
  margin-right: 8px;
}
.el-footer {
  .footer {
    text-align: center;
    padding-top: 20px;
    font-size: small;
    color: #999;
  }
}
</style>
