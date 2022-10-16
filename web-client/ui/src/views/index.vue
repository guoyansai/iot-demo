<script setup lang="ts"></script>

<template>
  <router-link class="mgr" to="/">首页</router-link>
  <router-link class="mgr" to="/test">测试页</router-link>
  <router-link class="mgr" to="/index1">框架内页</router-link>
  <router-link class="mgr" to="/est">est</router-link>
  <router-view></router-view>
</template>

<style scoped>
.mgr {
  margin-right: 10px;
}
</style>
