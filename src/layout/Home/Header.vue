<!-- @format -->

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

// import { setTheme } from '@/style/theme';

// 动态更新时间
const currentTime = ref(new Date().toLocaleString());
onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleString();
  }, 1000);
});

// const changeTheme = (themeName: string) => {
//   setTheme(themeName);
// };
</script>

<template>
  <div class="home-header">
    <div class="logo">此处应有LOGO</div>
    <div>值班人员：3号便利店</div>
    <div>时间: {{ currentTime }}</div>
    <!-- <div>
      <button @click="changeTheme('light')">浅色</button>
      <button @click="changeTheme('dark')">深色</button>
    </div> -->
  </div>
</template>

<style lang="less" scoped>
@import '@/style/less/home.less';

.home-header {
  background: var(--pc-bg-color-black-1);
  height: 100%;
  color: var(--pc-color);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: @aside_width;
  position: relative;
  user-select: none;
  * > {
    padding-right: 20px;
  }

  .logo {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: @aside_width;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      display: block;
      width: 100%;
    }
  }
}
</style>
