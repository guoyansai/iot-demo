<script lang="ts" setup>
import router from '../../router';
import { clearLocal } from '../../utils/Clear';

const logo = '/img/logo-asaiweb.png';
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const $router: any = router;
</script>

<template>
  <el-container class="common-container">
    <el-header>
      <el-menu
        router
        :default-active="$route.path"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="/">
          <img class="logo" :src="logo" />
        </el-menu-item>

        <div class="flex-grow"></div>

        <el-menu-item index="/user">用户</el-menu-item>

        <el-sub-menu index="/gongneng">
          <template #title>功能</template>
          <el-sub-menu index="/luntan">
            <template #title>论坛</template>
            <el-menu-item index="/bbs"> 发帖 </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/chat">聊天 </el-menu-item>
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
</template>
<style scoped lang="scss">
.logo {
  height: 58px;
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
