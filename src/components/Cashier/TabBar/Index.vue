<!-- @format -->

<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { usePageStateStore } from '@/stores/cashier-state';
import { useGoodsStore } from '@/stores/goods';

import {
  defineAsyncComponent,
  nextTick,
  reactive,
  ref,
  shallowRef,
  watch,
} from 'vue';

import type { cartItem } from '@/type/cart';
import type { goodsItem } from '@/type/goods';
import { ElMessage, type ElInput } from 'element-plus';

// tabsOptions {
//     name: 标题对应的名字（相当于id）
//     title: 标题名
//     content: 组件
//     closable: 标签是否可删除
//     editable: 标签是否处于编辑状态
//     props?: 传给组件的 props
// }
interface tabsOptions {
  name: string;
  title: string;
  content: any;
  closable: boolean;
  editable: boolean;
  props?: any;
}

// localOptions:  读取本地是否存有配置项
// tabsOptions： tabBar页面状态配置项
const localOptions = localStorage.getItem('tabbar-options');
const tabsOptions: tabsOptions[] = reactive(
  localOptions ? JSON.parse(localOptions) : []
);
watch(tabsOptions, (newOptions) => {
  console.log('watched tabsOptions change...');
  localStorage.setItem('tabbar-options', JSON.stringify(newOptions));
  tabsAmount.value = newOptions.length;

  if (tabsOptions.findIndex((tab) => tab.editable) === -1)
    cashier_preventDefault();
});

const titleInputRefArr = ref<InstanceType<typeof ElInput>[]>([]);
// 控制页面是否受 e.preventDefault() 影响
const pageState = usePageStateStore();
async function cashier_recoverDefault() {
  console.log('tabbar 的input框即将聚焦...');
  pageState.cashier_preventDefault = false;
  await nextTick();

  if (titleInputRefArr.value[0]) {
    titleInputRefArr.value[0].focus();
    titleInputRefArr.value[0].select();
  }
}
function cashier_preventDefault() {
  console.log('tabbar 的input框即将失焦...');
  pageState.cashier_preventDefault = true;
}

// 判断是否触发长按事件
let timer: ReturnType<typeof setTimeout>;
async function titleBoxMousedown(index: number) {
  console.log('titleBoxMousedown', index);
  await new Promise((res) => (timer = setTimeout(res, 800)));
  ElMessage.closeAll();
  ElMessage('触发长按事件');
  tabsOptions[index].editable = true;
  cashier_recoverDefault();
}
function titleBoxMouseup() {
  timer && clearTimeout(timer);
}

// tabsAmount： 标签栏数量
// tabName： 要切换到的标签栏名字（tabsOptions.name）
const tabsAmount = ref(tabsOptions.length);
const tabName = ref('1');
const lastTabName = ref('');
watch(tabName, (newName, oldName) => {
  console.log('watch tabName change...', newName, oldName);
  if (oldName) lastTabName.value = oldName;
});
function handleTabsEdit(
  targetName: string | undefined,
  action: 'remove' | 'add'
) {
  console.log('handleTabsEdit...', targetName, action);
  if (action === 'add') {
    const newTabName = `${++tabsAmount.value}`;
    tabsOptions.push({
      title: `新建分类${newTabName}`,
      name: newTabName,
      closable: true,
      editable: false,
      content: shallowRef(
        defineAsyncComponent(
          () => import('@/components/Cashier/TabBar/TheNewContent.vue')
        )
      ),
      props: {
        data: [],
      },
    });

    tabName.value = newTabName;
  } else if (action === 'remove') {
    const tabs = [...tabsOptions];
    let activeName = tabName.value;

    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) activeName = nextTab.name;
        }
      });
    }

    tabName.value = activeName;
    tabsOptions.length = 0;
    tabs
      .filter((tab) => tab.name !== targetName)
      .forEach((tab) => tabsOptions.push(tab));
  }
}
function addTab(tab: tabsOptions): string {
  console.log('addTab', tab);
  lastTabName.value = tabName.value;
  const currTabName = tabName.value;
  tabsOptions.push(tab);
  tabName.value = tab.name;

  return currTabName;
}
function removeTab(targetName: string) {
  console.log('removeTab', targetName);
  const tabsOptionMap = [...tabsOptions];
  tabsOptions.length = 0;
  tabsOptionMap
    .filter((tab) => tab.name !== targetName)
    .forEach((tab) => tabsOptions.push(tab));
  tabName.value = lastTabName.value;
}

const componentObj = [
  shallowRef(
    defineAsyncComponent(
      () => import('@/components/Cashier/TabBar/TheContent1.vue')
    )
  ),
  shallowRef(
    defineAsyncComponent(
      () => import('@/components/Cashier/TabBar/TheContent2.vue')
    )
  ),
  shallowRef(
    defineAsyncComponent(
      () => import('@/components/Cashier/TabBar/TheContent3.vue')
    )
  ),
  shallowRef(
    defineAsyncComponent(
      () => import('@/components/Cashier/TabBar/TheNewContent.vue')
    )
  ),
];
function initTabBar() {
  if (localOptions) {
    let compIndex = 0;
    for (let i = 0; i < tabsOptions.length; i++) {
      if (!tabsOptions[i].closable) {
        tabsOptions[i].content = componentObj[compIndex];
        compIndex++;
      } else tabsOptions[i].content = componentObj[3];

      tabsOptions[i].editable = false;
    }

    const findIndexRes = tabsOptions.findIndex(
      (tab) => tab.name === 'search-result'
    );
    if (findIndexRes > -1) tabsOptions.splice(findIndexRes, 1);
  } else {
    const options: tabsOptions[] = [
      {
        title: `自定义商品`,
        name: `1`,
        closable: false,
        editable: false,
        content: componentObj[0],
        props: { data: [] },
      },
      {
        title: `常售商品`,
        name: `2`,
        closable: false,
        editable: false,
        content: componentObj[1],
        props: { data: [] },
      },
      {
        title: `全部商品`,
        name: `3`,
        closable: false,
        editable: false,
        content: componentObj[2],
        props: { data: [] },
      },
    ];

    tabsOptions.push(...options);
  }
}

defineExpose({
  handleTabsEdit,
  addTab,
  removeTab,
});

initTabBar();
</script>

<template>
  <el-tabs v-model="tabName" type="card" addable @edit="handleTabsEdit">
    <el-tab-pane
      v-for="(
        { name, title, closable, content, editable, props }, index
      ) in tabsOptions"
      :key="name"
      :name="name"
      :closable="closable"
      lazy
    >
      <template #label>
        <template v-if="!editable">
          <span
            style="display: inline-block"
            @mousedown="titleBoxMousedown(index)"
            @mouseup="titleBoxMouseup"
            >{{ title }}</span
          >
        </template>

        <template v-else>
          <el-input
            ref="titleInputRefArr"
            v-model="tabsOptions[index].title"
            @keydown.stop
            @keydown.enter="cashier_preventDefault"
            @blur="tabsOptions[index].editable = false"
          ></el-input>
        </template>
      </template>
      <!-- @item-click-event="addItemToCart" -->
      <el-scrollbar>
        <component :is="content" v-bind="props"></component>
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="less" scoped>
@import '@/style/less/cashier.less';

.el-tabs {
  --el-tabs-header-height: @tabbar_header_height;
  display: flex;
  flex-direction: column;
  user-select: none;

  :deep(.el-tabs__header) {
    background: var(--pc-bg-color-white);
    height: var(--el-tabs-header-height);
    margin-bottom: 0;
    padding: 0 10px;

    .el-input {
      width: 95%;
    }
  }
  :deep(.el-tabs__content) {
    box-sizing: border-box;
    padding: 5px 10px;
    min-height: 0;
    flex: 1;
    color: #6b778c;
    font-size: 18px;
    font-weight: 700;
    background: #f1f1f1;

    .el-tab-pane {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
