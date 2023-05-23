<!-- @format -->

<script lang="ts" setup>
import type { ElInput } from 'element-plus';
import {
  defineAsyncComponent,
  nextTick,
  provide,
  reactive,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue';
import { usePageStateStore } from '@/stores/cashier-state';
import { useGoodsStore } from '@/stores/goods';
import type { baseCartItem, cartItem } from '@/type/cart';
import { useCartStore } from '@/stores/cart';
import type { baseGoodsItem, goodsItem } from '@/type/goods';

interface editableTabs {
  name: string;
  title: string;
  closable: boolean;
  content?: any;
}
type ELInputRef = InstanceType<typeof ElInput>;
type changeDatalist = (goodsInfo: baseCartItem) => void;

const TabBar_Content1 = defineAsyncComponent(
  () => import('@/components/Cashier/TabBar/TheContent1.vue')
);
const TabBar_Content2 = defineAsyncComponent(
  () => import('@/components/Cashier/TabBar/TheContent2.vue')
);
const TabBar_Content3 = defineAsyncComponent(
  () => import('@/components/Cashier/TabBar/TheContent3.vue')
);
const editableTabsValue = ref('1'); // 要选中哪个tabbar（值为editableTabs子元素的name）
const editableTabs: editableTabs[] = reactive([]); // 存放tabs配置项的数组
const initTabBar = () => {
  const tabbarOptions: editableTabs[] = [
    {
      title: `自定义商品`,
      name: `1`,
      closable: false,
      content: shallowRef(TabBar_Content1),
    },
    {
      title: `常售商品`,
      name: `2`,
      closable: false,
      content: shallowRef(TabBar_Content2),
    },
    {
      title: `全部商品`,
      name: `3`,
      closable: false,
      content: shallowRef(TabBar_Content3),
    },
  ];
  editableTabs.push(...tabbarOptions);
};

// 增加或删除 tab 的处理函数
const tabIndex = ref(0);
const handleTabsEdit = (targetName: string, action: 'remove' | 'add') => {
  if (action === 'add') {
    const newTabName = `${++tabIndex.value}`;
    editableTabs.push({
      title: `新建分类${tabIndex.value}`,
      name: newTabName,
      closable: true,
      content: shallowRef(
        defineAsyncComponent(
          () => import('@/components/Cashier/TabBar/TheNewContent.vue')
        )
      ),
    });
    editableTabsValue.value = newTabName;
  } else if (action === 'remove') {
    const tabs = [...editableTabs];
    let activeName = editableTabsValue.value;
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

    editableTabsValue.value = activeName;
    editableTabs.length = 0;
    tabs
      .filter((tab) => tab.name !== targetName)
      .forEach((item) => {
        editableTabs.push(item);
      });
  }
};

// 实现自定义编辑 tab 栏
const titleValueArray = reactive<string[]>([]); // 存放各个 title 的 input 值
const titleInputRefArray = ref<ELInputRef[]>([]);
const pageState = usePageStateStore(); // 控制页面是否受e.preventDefault()影响
const cashier_recoverDefault = (index: number) => {
  pageState.cashier_preventDefault = false;
  titleInputRefArray.value[index]!.focus();
  titleInputRefArray.value[index]!.select();
};
const cashier_preventDefault = (index: number) => {
  pageState.cashier_preventDefault = true;
  isEditArray[index] = false;
  editableTabs[index].title = titleValueArray[index];
};

const isEditArray: boolean[] = reactive([]);
// const isEditArray = reactive(new Array(3).fill(false));
// 判断是否处于长按事件
let mousedownIndex = 0;
let mouseupIndex = 0;
let timestamp_start = 0;
let timestamp_end = 0;
const inputBoxMousedown = (index: number) => {
  console.log('inputBoxMousedown', index);
  timestamp_start = new Date().getTime();
  mousedownIndex = index;
};
const inputBoxMouseup = async (index: number) => {
  console.log('inputBoxMouseup', index);
  timestamp_end = new Date().getTime();
  mouseupIndex = index;

  const interval = timestamp_end - timestamp_start;
  if (interval >= 1000) {
    console.log('长按事件...');
    if (mousedownIndex === mouseupIndex) {
      isEditArray[mouseupIndex] = true;
      await nextTick();
      cashier_recoverDefault(mouseupIndex);
    }
  }

  timestamp_start = 0;
  timestamp_end = 0;
};

const datalist: baseCartItem[] = reactive([]);
const datalist_new_content: baseCartItem[] = reactive([]);
for (let i = 0; i < 32; i++) {
  datalist.push({
    goodsCode: `69740562800${i}`,
    name: `商品test-${i}`,
    price: 2 * i,
  });
}
const changeDatalist: changeDatalist = (goodsInfo) => {
  console.log('changeDatalist', goodsInfo);
  datalist.push({
    goodsCode: goodsInfo.goodsCode,
    name: goodsInfo.name,
    price: goodsInfo.price,
  });
};
provide<{
  changeDatalist: changeDatalist;
}>('change-datalist', { changeDatalist });

const goodsStore = useGoodsStore();
const cartStore = useCartStore();
// 添加商品到购物车 cart
const addItemToCart = (goodsCode: string) => {
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
};

initTabBar();
watchEffect(() => {
  tabIndex.value = editableTabs.length;
  for (let i = 0; i < editableTabs.length; i++) {
    isEditArray[i] = false;
    titleValueArray[i] = editableTabs[i].title;
  }
});
watchEffect(() =>
  localStorage.setItem('tabbar-options', JSON.stringify(editableTabs))
);
</script>

<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    addable
    @edit="handleTabsEdit"
  >
    <el-tab-pane
      v-for="({ name, title, closable, content }, index) in editableTabs"
      :key="name"
      :name="name"
      :closable="closable"
      lazy
    >
      <template #label>
        <template v-if="!isEditArray[index]">
          <span
            @mousedown="inputBoxMousedown(index)"
            @mouseup="inputBoxMouseup(index)"
            >{{ title }}</span
          >
        </template>
        <template v-else>
          <el-input
            v-model="titleValueArray[index]"
            :ref="(el: ELInputRef) => (titleInputRefArray[index] = el)"
            @click="cashier_recoverDefault(index)"
            @blur="cashier_preventDefault(index)"
            @keyup.enter="cashier_preventDefault(index)"
          ></el-input>
        </template>
      </template>

      <el-scrollbar>
        <component
          :is="content"
          :datalist="datalist"
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
      width: 150px;
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
