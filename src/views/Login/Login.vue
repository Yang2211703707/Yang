<!-- @format -->

<script setup lang="ts">
import Auth from '@/utils/auth';
import { computed, ref, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const countDown = ref(3);
watch(
  () => Auth.isLoggedIn,
  async (newState) => {
    if (newState) {
      for (let i = countDown.value - 1; i >= 0; i--) {
        await sleep(1000);
        countDown.value = i;
      }
      const prePath = route.query.redirect;
      router.push(prePath ? prePath + '' : '/');
    }
  },
  {
    immediate: true,
  }
);
function sleep(interval: number) {
  return new Promise((res) => setTimeout(res, interval));
}

// const prePath = route.query.redirect;
// console.log(prePath, Auth);
// if (Auth.isLoggedIn) router.push(prePath ? prePath + '' : '/');
</script>

<template>
  <template v-if="Auth.isLoggedIn">
    <div>已登录！<a>点击此处</a>或{{ countDown }}秒后自动跳转到主页。。。</div>
  </template>

  <template v-else>
    <div>Login Page</div>
  </template>
</template>

<style lang="less" scoped></style>
