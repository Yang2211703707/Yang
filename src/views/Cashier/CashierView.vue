<!-- @format -->

<script setup lang="ts">
import CheckOut from '@/components/Cashier/CheckOut/Index.vue';
import TabBar from '@/components/Cashier/TabBar/Index.vue';
import Tools from '@/components/Cashier/Tools/Index.vue';
import InputBar from '@/components/Cashier/InputBar/Index.vue';

import {
  defineAsyncComponent,
  nextTick,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';

import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';

import { usePageStateStore } from '@/stores/cashier-state';

import type { baseCartItem } from '@/type/cart';

console.log('CashierView Comp is running!');

onBeforeRouteUpdate((to, from) => {
  console.log('CashierView Comp onBeforeRouteUpdate', 'to:', to, 'from:', from);
});
onBeforeRouteLeave((to, from) => {
  console.log('CashierView Comp onBeforeRouteLeave', 'to:', to, 'from:', from);
});

// 进入 cashier 组件，则 inputBar 聚焦
const inputBarRef = ref<InstanceType<typeof InputBar>>();
const route = useRoute();
watchEffect(async () => {
  if (route.path === '/cashier') {
    await nextTick();
    inputBarRef.value?.inputFocus();
  }
});

// 根据 cashier_preventDefault 控制 cashier组件内 是否使用preventDefault
const { cashier_preventDefault } = storeToRefs(usePageStateStore());
watch(cashier_preventDefault, (newState) => {
  if (newState && inputBarRef.value) inputBarRef.value.inputFocus();
});
function handleMousedown(e: MouseEvent) {
  if (cashier_preventDefault.value) e.preventDefault();
}

const tabBarRef = ref<InstanceType<typeof TabBar> | null>(null);
const showSearchRes = ref(false);
watch(showSearchRes, (newState) => {
  if (!tabBarRef.value) {
    ElMessage('获取tabbar实例异常！');
    return;
  }

  if (!newState) tabBarRef.value.removeTab('search-result');
});
async function chooseSearchRes(resList: baseCartItem[]) {
  console.log('chooseSearchRes', resList);
  if (!tabBarRef.value) return;

  showSearchRes.value = false;
  await nextTick();
  showSearchRes.value = true;
  tabBarRef.value.addTab({
    name: 'search-result',
    title: '搜索结果',
    content: shallowRef(
      defineAsyncComponent(
        () => import('@/components/Cashier/TabBar/TheNewContent.vue')
      )
    ),
    closable: true,
    editable: false,
    props: {
      data: resList,
    },
  });
}
</script>

<script lang="ts">
export default {
  beforeRouteEnter(to, from, next) {
    console.log('beforeRouteEnter...', 'to:', to, 'from:', from);
    next((vm) => {
      console.log('vm:', vm);
    });
  },
};
</script>

<template>
  <div class="cashier" @mousedown="handleMousedown">
    <CheckOut class="left"></CheckOut>

    <section class="right">
      <TabBar class="right-header" ref="tabBarRef"></TabBar>

      <InputBar
        ref="inputBarRef"
        @empty-result="showSearchRes = false"
        @choose-result="chooseSearchRes"
      ></InputBar>

      <Tools></Tools>
    </section>
  </div>
</template>

<style lang="less" scoped>
@import '@/style/less/home.less';
@import '@/style/less/cashier.less';

* {
  box-sizing: border-box;
}

.cashier {
  display: flex;
  height: @main_height;
  width: @main_width;

  .left {
    flex: 2;
    flex-shrink: 0;
    background-color: #ddfbfb;
    min-width: 0;
  }

  .right {
    flex: 3;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background-color: var(--pc-bg-color-white-2);
    min-width: 0;

    .right-header {
      height: 0;
      flex: 1;
    }
  }
}
</style>
