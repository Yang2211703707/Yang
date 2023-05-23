<!-- @format -->

<script setup lang="ts">
import { ref } from 'vue';
import { DataAnalysis, Setting } from '@element-plus/icons';

// 控制是否折叠菜单列表
const props = defineProps<{ collapse: boolean }>();
const isCollapse = ref(props.collapse);

// 侧边菜单列表（不包含下面两个）
const menuList = [
  {
    path: '/cashier',
    name: 'cashier',
    label: '前台收银',
    icon: 'icon-shouyintai',
  },
  {
    path: '/goods',
    name: 'goods',
    label: '商品管理',
    icon: 'icon-shangpin',
  },
  {
    path: '/order',
    name: 'order',
    label: '订单管理',
    icon: 'icon-dingdanguanli',
  },
  {
    path: '/report',
    name: 'report',
    label: '经营报表',
    icon: 'icon-shujutongji',
  },
  {
    path: '/test',
    name: 'test',
    label: '测试页面',
    icon: 'icon-shujutongji',
  },
];

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<template>
  <el-menu
    class="home-aside"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#409EFF"
    router
    :default-active="$route.path"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <template v-for="{ path, label, icon } in menuList" :key="path">
      <el-menu-item :index="path">
        <el-icon>
          <i class="iconfont" :class="icon"></i>
        </el-icon>

        <template #title>{{ label }}</template>
      </el-menu-item>
    </template>

    <el-menu-item index="/statistics" class="statistics">
      <el-icon><DataAnalysis /></el-icon>
      <template #title>业务统计</template>
    </el-menu-item>

    <el-menu-item index="/options" class="options">
      <el-icon><setting /></el-icon>
      <template #title>设置</template>
    </el-menu-item>
  </el-menu>
</template>

<style lang="less" scoped>
@import '@/style/less/home.less';

.home-aside {
  position: relative;
  padding-top: 20px;
  user-select: none;
  &:not(.el-menu--collapse) {
    width: @aside_width;
    min-height: @main_height;
    padding-bottom: @aside_item_height * 2;
  }

  .el-menu {
    &-item {
      height: @aside_item_height;
    }
  }

  .statistics,
  .options {
    position: absolute;
    width: @aside_width;
    height: @aside_item_height;
    bottom: 0px;
    left: 0px;
  }
  .statistics {
    bottom: @aside_item_height;
  }
}
</style>
