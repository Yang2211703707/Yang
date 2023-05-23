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
  toRefs,
  watch,
  watchEffect,
} from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { usePageStateStore } from '@/stores/cashier-state';
import type { baseCartItem } from '@/type/cart';
import { ElMessage } from 'element-plus';

// 进入cashier则聚焦到inputBar
const inputBarRef = ref<InstanceType<typeof InputBar>>();
const { path } = toRefs(useRoute());
watchEffect(async () => {
  if (path.value === '/cashier') {
    await nextTick();
    inputBarRef.value?.inputFocus();
  }
});

// 根据 cashier_preventDefault 控制 cashier组件内 是否使用preventDefault
const { cashier_preventDefault } = storeToRefs(usePageStateStore());
watchEffect(() => {
  if (cashier_preventDefault.value) inputBarRef.value?.inputFocus();
});
// 由于点击会先触发mousedown再触发点击事件，mousedown时 cashier_preventDefault 的值不是最新的，因此要另外watchEffect去执行inputBar的focus
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

  if (newState === false) {
    tabBarRef.value.removeTab('search-result');
  }
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

<template>
  <div class="cashier" @mousedown="handleMousedown">
    <div class="left">
      <CheckOut></CheckOut>
    </div>

    <div class="right">
      <div class="tab-area">
        <TabBar ref="tabBarRef"></TabBar>
      </div>
      <div class="input-area">
        <InputBar
          ref="inputBarRef"
          @empty-result="showSearchRes = false"
          @choose-result="chooseSearchRes"
        ></InputBar>
      </div>
      <div class="tools-area">
        <Tools></Tools>
      </div>
    </div>
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
    // background-color: var(--pc-bg-color-white-1);
    min-width: 0;
    height: 100%;
  }

  .right {
    flex: 3;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background-color: var(--pc-bg-color-white-2);
    width: 0;
    height: 100%;

    .tab-area {
      min-height: 0;
      flex: 1;
      box-sizing: border-box;
    }

    .tools-area {
      height: @common_footer_height;
      border-left: 1px solid var(--pc-color--yellow-1);
    }
  }
}
</style>
