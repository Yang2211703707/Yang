<!-- @format -->

<script lang="ts" setup>
import {
  defineAsyncComponent,
  nextTick,
  reactive,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { usePageStateStore } from '@/stores/cashier-state';
import { useGoodsStore } from '@/stores/goods';
import { useCartStore } from '@/stores/cart';

import type { ElInput } from 'element-plus';
import type { baseCartItem, cartItem } from '@/type/cart';
import type { goodsItem } from '@/type/goods';
interface tabsOptions {
  name: string;
  label: string;
  newLabel: string;
  closable: boolean;
  editable: boolean;
  props: { data: baseCartItem[] };
  constant: boolean;
  content?: any;
}
type ELInputRef = InstanceType<typeof ElInput>;

const localOptions = localStorage.getItem('tabbar-options');
// 存放tabs配置项的数组
const tabsOptions: tabsOptions[] = reactive(
  localOptions ? JSON.parse(localOptions) : []
);
watch(tabsOptions, (newTabsOptions) => {
  console.log('watched tabsOptions change...');
  localStorage.setItem('tabbar-options', JSON.stringify(newTabsOptions));
  tabsAmount.value = newTabsOptions.length;
});
function initTabBar() {
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

  if (localOptions) {
    let compIndex = 0;
    for (let i = 0; i < tabsOptions.length; i++) {
      if (tabsOptions[i].constant) {
        tabsOptions[i].content = componentObj[compIndex];
        compIndex++;
      } else tabsOptions[i].content = componentObj[3];

      tabsOptions[i].editable = false;
    }
  } else {
    const options: tabsOptions[] = [
      {
        label: `自定义商品`,
        newLabel: `自定义商品`,
        name: `1`,
        closable: false,
        editable: false,
        content: componentObj[0],
        props: { data: [{ goodsCode: '111', name: 'test1', price: 111 }] },
        constant: true,
      },
      {
        label: `常售商品`,
        newLabel: `常售商品`,
        name: `2`,
        closable: false,
        editable: false,
        content: componentObj[1],
        props: { data: [{ goodsCode: '222', name: 'test2', price: 222 }] },
        constant: true,
      },
      {
        label: `全部商品`,
        newLabel: `全部商品`,
        name: `3`,
        closable: false,
        editable: false,
        content: componentObj[2],
        props: { data: [{ goodsCode: '333', name: 'test3', price: 333 }] },
        constant: true,
      },
    ];

    tabsOptions.push(...options);
  }
}

const tabsAmount = ref(tabsOptions.length || 0); // tabs的个数
const tabName = ref('1'); // 要选中哪个 tab（值对应 tabsOptions.name）
watch(tabsAmount, () => {
  for (let i = 0; i < tabsOptions.length; i++) {
    editableArray[i] = false;
    tabLabelArray[i] = tabsOptions[i].label;
  }
});
// watchEffect(() => {
//   tabsAmount.value = tabsOptions.length;
//   for (let i = 0; i < tabsOptions.length; i++) {
//     editableArray[i] = false;
//     tabLabelArray[i] = tabsOptions[i].label;
//   }
// });

// 向 tabsOptions 增加或删除 tab 的处理函数
function handleTabsEdit(
  targetName: string | undefined,
  action: 'remove' | 'add'
) {
  console.log('handleTabsEdit...', targetName, action);
  if (action === 'add') {
    const newTabName = `${++tabsAmount.value}`;
    tabsOptions.push({
      label: `新建分类${newTabName}`,
      newLabel: `新建分类${newTabName}`,
      name: newTabName,
      closable: true,
      editable: false,
      content: shallowRef(
        defineAsyncComponent(
          () => import('@/components/Cashier/TabBar/TheNewContent.vue')
        )
      ),
      props: {
        data: [
          {
            goodsCode: newTabName.repeat(3),
            name: `test${newTabName}`,
            price: Number(newTabName),
          },
        ],
      },
      constant: false,
    });
    // if (newTabName == '5') {
    //   tabsOptions[4].closable = false;
    // }

    tabName.value = newTabName;
  } else if (action === 'remove') {
    const tabs = [...tabsOptions];
    let activeName = tabName.value;
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.name;
          }
        }
      });
    }

    tabName.value = activeName;
    tabsOptions.length = 0;
    tabs
      .filter((tab) => tab.name !== targetName)
      .forEach((item) => {
        tabsOptions.push(item);
      });
  }
}

// 自定义编辑 tab 栏
const editableArray: boolean[] = reactive([]); // 控制 label 是否可编辑
const tabLabelArray: string[] = reactive([]); // 存放各个 label 的 input 值
const labelInputRefs = ref<ELInputRef[]>([]);
watch(labelInputRefs, (refs) => {
  refs.forEach((inputRef) => {});
});
const pageState = usePageStateStore(); // 控制页面是否受e.preventDefault()影响
const inputVal = ref('');
function cashier_recoverDefault(index: number) {
  console.log('label input focus...');
  pageState.cashier_preventDefault = false;
  labelInputRefs.value[index]?.focus();
  labelInputRefs.value[index]?.select();
}
function cashier_preventDefault(index: number) {
  console.log('label input blur...');
  pageState.cashier_preventDefault = true;
  tabsOptions[index].editable = false;
  tabsOptions[index].label = inputVal.value;
}
// function cashier_recoverDefault(index: number) {
//   pageState.cashier_preventDefault = false;
//   labelInputRefs.value[index]?.focus();
//   labelInputRefs.value[index]?.select();
// }
// function cashier_preventDefault(index: number) {
//   pageState.cashier_preventDefault = true;
//   tabsOptions[index].editable = false;
//   tabsOptions[index].label = tabsOptions[index].newLabel;
//   //   tabsOptions[index].label = tabLabelArray[index];
// }

// 判断是否处于长按事件
let mousedownIndex = 0;
let mouseupIndex = 0;
let timestamp_start = 0;
let timestamp_end = 0;
let timer: ReturnType<typeof setTimeout>;
// async function inputBoxMousedown(index: number) {
//   console.log('inputBoxMousedown', index);

//   await new Promise((res) => (timer = setTimeout(res, 800)));
//   ElMessage('长按事件触发！');
//   tabsOptions[index].editable = true;
//   inputVal.value = tabsOptions[index].label;
//   await new Promise((res) => setTimeout(res, 2000));
//   ElMessage('即将focus！');
//   console.log('afdasdfweer');
//   cashier_recoverDefault(index);

//   return;
//   timer = setTimeout(async () => {
//     ElMessage('长按事件触发！');
//     tabsOptions[index].editable = true;
//     inputVal.value = tabsOptions[index].label;
//     await new Promise((res) => {
//       setTimeout(res, 1000);
//     });
//     cashier_recoverDefault(index);
//   }, 800);
// }
// function inputBoxMouseup(index: number) {
//   console.log('inputBoxMouseup', index);
//   timer && clearTimeout(timer);
//   return;
// }
function inputBoxMousedown(index: number) {
  console.log('inputBoxMousedown', index);
  timestamp_start = new Date().getTime();
  mousedownIndex = index;
}
async function inputBoxMouseup(index: number) {
  console.log('inputBoxMouseup', index);
  timestamp_end = new Date().getTime();
  mouseupIndex = index;

  const interval = timestamp_end - timestamp_start;
  if (interval >= 1000) {
    console.log('tabbar 的 input 框触发长按事件...');
    if (mousedownIndex === mouseupIndex) {
      tabsOptions[mouseupIndex].editable = true;
      inputVal.value = tabsOptions[mouseupIndex].label;
      await nextTick();
      cashier_recoverDefault(mouseupIndex);
    }
  }

  timestamp_start = 0;
  timestamp_end = 0;
}

const goodsStore = useGoodsStore();
const cartStore = useCartStore();
// 添加商品到购物车 cart
function addItemToCart(goodsCode: string) {
  const findGoodsRes: goodsItem | {} = goodsStore.findToGoodsList(goodsCode);

  // 如果商品在 goodsList 中
  if (JSON.stringify(findGoodsRes) !== '{}') {
    const findCartRes: cartItem | {} = cartStore.findToCart(goodsCode);

    // 如果商品在 cart 中
    if (JSON.stringify(findCartRes) !== '{}') {
      cartStore.addToCart(findCartRes as cartItem);
    } else {
      const cartItem = cartStore.cartItemGenerator({
        goodsCode: (findGoodsRes as goodsItem).goodsCode,
        name: (findGoodsRes as goodsItem).name,
        price: (findGoodsRes as goodsItem).price,
      });
      cartStore.addToCart(cartItem);
    }
  }
}

initTabBar();
</script>

<template>
  <el-tabs v-model="tabName" type="card" addable @edit="handleTabsEdit">
    <el-tab-pane
      v-for="(
        { name, label, closable, content, editable, props }, index
      ) in tabsOptions"
      :key="name"
      :name="name"
      :closable="closable"
      lazy
    >
      <template #label>
        <template v-if="!editable">
          <span
            @mousedown="inputBoxMousedown(index)"
            @mouseup="inputBoxMouseup(index)"
            >{{ label }}</span
          >
        </template>
        <!-- (el: ELInputRef) => (labelInputRefs[index] = el) -->
        <template v-else>
          <el-input
            v-model="inputVal"
            ref="labelInputRefs"
            @click="cashier_recoverDefault(index)"
            @blur="cashier_preventDefault(index)"
            @keyup.enter="cashier_preventDefault(index)"
            @keydown.stop
          ></el-input>
        </template>
      </template>
      <!-- <template #label>
        <template v-if="!tabsOptions[index].editable">
          <span
            @mousedown="inputBoxMousedown(index)"
            @mouseup="inputBoxMouseup(index)"
            >{{ label }}</span
          >
        </template>
        <template v-else>
          <el-input
            v-model="tabLabelArray[index]"
            :ref="(el: ELInputRef) => (labelInputRefs[index] = el)"
            @click="cashier_recoverDefault(index)"
            @blur="cashier_preventDefault(index)"
            @keyup.enter="cashier_preventDefault(index)"
          ></el-input>
        </template>
      </template> -->

      <el-scrollbar>
        <component
          :is="content"
          v-bind="props"
          @item-click-event="addItemToCart"
        ></component>
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="less" scoped>
@import '@/style/less/cashier.less';

.el-tabs {
  --el-tabs-header-height: @tabbar_header_height;
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;

  :deep(.el-tabs__header) {
    background: var(--pc-bg-color-white);
    height: var(--el-tabs-header-height);
    margin-bottom: 0;
    padding: 0 10px;

    .el-input {
      //   width: 70%;
      z-index: 9;
      //   width: 150px;
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
