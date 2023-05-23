<!-- @format -->

<script setup lang="ts">
import MyAside from '@/layout/Home/Aside.vue';
import MyHeader from '@/layout/Home/Header.vue';

import { ref } from 'vue';

const isCollapse = ref(false);
</script>

<template>
  <el-container>
    <el-header @mousedown.prevent>
      <my-header></my-header>
    </el-header>

    <el-container>
      <el-aside @mousedown.prevent>
        <el-scrollbar>
          <my-aside :collapse="isCollapse"></my-aside>
        </el-scrollbar>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
@import '@/style/less/home.less';

.el-header {
  padding: 0;
  height: @header_height;
}
.el-aside {
  padding: 0;
  width: @aside_width;
  height: @main_height;
}
.el-main {
  padding: 0;
  height: @main_height;
}
</style>
