<template>
  <div class="bar-wraps">
    <div ref="bar" class="bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
let speed = ref<number>(1);
let bar = ref<HTMLElement>();
let timer = ref<number>(0);

// 路由守卫中调用
const startLoading = () => {
  let dom = bar.value as HTMLElement;
  dom.style.opacity = '100';
  speed.value = 1;
  timer.value = window.requestAnimationFrame(function fn() {
    if (speed.value < 90) {
      speed.value += 1;
      dom.style.width = speed.value + '%';
      timer.value = window.requestAnimationFrame(fn);
    } else {
      speed.value = 1;
      window.cancelAnimationFrame(timer.value);
    }
  });
};

// 路由加载后调用
const endLoading = () => {
  let dom = bar.value as HTMLElement;
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      speed.value = 100;
      dom.style.width = speed.value + '%';
      window.requestAnimationFrame(() => {
        dom.style.opacity = '0';
      });
    });
  }, 500);
};

// defineExpose将子组件中的方法主动暴露出来给父组件使用
defineExpose({
  startLoading,
  endLoading,
});
</script>

<style scoped lang="scss">
.bar-wraps {
  position: fixed;
  top: 0;
  width: 100%;
  height: 2px;
  .bar {
    height: inherit;
    width: 0;
    background: #009fa8;
  }
}
</style>
