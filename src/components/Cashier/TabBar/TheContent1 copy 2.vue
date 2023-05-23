<!-- @format -->

<script setup lang="ts">
import { Plus } from '@element-plus/icons';
import GoodsInfoDialog from '@/components/Cashier/TabBar/GoodsInfoDialog.vue';

import { reactive, ref, watch, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { usePageStateStore } from '@/stores/cashier-state';
import { useCartStore } from '@/stores/cart';
import { useGoodsStore } from '@/stores/goods';

import type { baseCartItem } from '@/type/cart';
import type { goodsItem } from '@/type/goods';

interface emit {
  (e: 'item-click-event', goodsCode: string): void;
}

const localContent1 = localStorage.getItem('tabbar-content1-datalist');
const datalist: baseCartItem[] = reactive(
  localContent1 ? JSON.parse(localContent1) : []
);
// for (let i = 0; i < 32; i++) {
//   datalist.push({
//     goodsCode: `69740562800${i}`,
//     name: `商品test-${i}`,
//     price: 2 * i,
//   });
// }
watch(datalist, (newDatalist) =>
  localStorage.setItem('tabbar-content1-datalist', JSON.stringify(newDatalist))
);

const emit = defineEmits<emit>();
const { cashier_preventDefault } = storeToRefs(usePageStateStore());
const showDialog_addItem = ref(false);
watchEffect(() => {
  if (showDialog_addItem.value) cashier_preventDefault.value = false;
  else cashier_preventDefault.value = true;
});

const { addToCart, cartItemGenerator } = useCartStore();
const { findToGoodsList, goodsGenerator, addToGoodsList } = useGoodsStore();
// 获取当前点击的是哪个元素
const handleItemClick = (e: any) => {
  console.log('handleItemClick', e, e.path);
  const pathArr: HTMLElement[] = e.path;
  const findIndexRes = pathArr.findIndex(
    (element) => element.classList && element.classList.contains('list-item')
  );
  if (findIndexRes === -1) return;

  const dataItem = pathArr[findIndexRes].dataset['item'] as string;
  if (/\d/g.test(dataItem)) {
    const findGoodsRes = findToGoodsList(dataItem, 1);
    if (findGoodsRes.length > 0) {
      const newCartItem = cartItemGenerator({
        goodsCode: findGoodsRes[0].goodsCode,
        name: findGoodsRes[0].name,
        price: findGoodsRes[0].price,
        cost: findGoodsRes[0].cost,
        unit: findGoodsRes[0].unit,
      });
      addToCart(newCartItem);
      console.log(findGoodsRes, newCartItem);
    }
  } else if (dataItem === 'add') showDialog_addItem.value = true;
};
const confirmAddGoods = (goodsInfo: goodsItem) => {
  console.log('confirmAddGoods', goodsInfo);
  showDialog_addItem.value = false;
  datalist.push({
    goodsCode: goodsInfo.goodsCode,
    name: goodsInfo.name,
    price: goodsInfo.price,
  });
  const newGoods = goodsGenerator({
    goodsCode: goodsInfo.goodsCode,
    name: goodsInfo.name,
    price: goodsInfo.price,
    unit: goodsInfo.unit,
    category: goodsInfo.category,
    cost: goodsInfo.cost,
    stock: goodsInfo.stock,
  });
  addToGoodsList(newGoods);
  console.log('confirmAddGoods -- newGoods: ', newGoods);
};

const confirmModified = () => {
  console.log('tabbar content1 confirmModified');
  const modifiedRes: goodsItem = {
    goodsCode: goodsCodeInput.value,
    name: goodsNameInput.value,
    unit: goodsUnitInput.value,
    category: goodsCategoryInput.value,
    price: Number(goodsPriceInput.value),
    cost: Number(goodsCostInput.value),
    stock: Number(goodsStockInput.value),
    creatTime: new Date().getTime(),
  };
  console.log(modifiedRes);
  showDialog_addItem.value = false;
};

const goodsCodeInput = ref('');
const goodsNameInput = ref('');
const goodsUnitInput = ref('');
const goodsCategoryInput = ref('');
const goodsPriceInput = ref<string | number>(0);
const goodsCostInput = ref<string | number>(0);
const goodsStockInput = ref<string | number>(0);
const formatInput_number = (
  input: string,
  target: 'goodsCode' | 'price' | 'cost' | 'stock',
  decimal: number = 0
) => {
  console.log('formatPriceInput', input);

  let replaceRes = '';
  if (decimal === 0) {
    replaceRes = input
      .replace(/[^\d.-]/g, '')
      .replace(/(-?\d*)([\d.-]*)/, '$1');
  } else if (decimal === 2) {
    replaceRes = input
      .replace(/[^\d.]/g, '')
      .replace(/(\d*.?\d{0,2})([\d.]*)/, '$1');
  }

  if (target === 'goodsCode') goodsCodeInput.value = replaceRes;
  else if (target === 'price') goodsPriceInput.value = replaceRes;
  else if (target === 'cost') goodsCostInput.value = replaceRes;
  else if (target === 'stock') goodsStockInput.value = replaceRes;
};

// const confirmAddGoods = (goodsInfo: goodsItem) => {
//   console.log('confirmAddGoods', goodsInfo);
//   showDialog_addItem.value = false;

// };

// #region
// const goodsInfo = ref<goodsItem>({
//   goodsCode: '1000',
//   name: '自定义商品',
//   unit: '个',
//   category: '未定义',
//   price: 250,
//   cost: 233,
//   stock: 999,
//   creatTime: new Date().getTime(),
// });
// const goodsInfoArray: goodsInfo[] = reactive([
//   {
//     id: 'code',
//     disabled: true,
//     value: 1000,
//     must: false,
//   },
//   {
//     id: 'name',
//     disabled: false,
//     value: '',
//     must: true,
//   },
//   {
//     id: 'unit',
//     disabled: false,
//     value: '',
//     must: false,
//   },
//   {
//     id: 'category',
//     disabled: false,
//     value: '',
//     must: false,
//   },
//   {
//     id: 'price',
//     disabled: false,
//     value: 0,
//     must: false,
//   },
//   {
//     id: 'cost',
//     disabled: false,
//     value: 0,
//     must: false,
//   },
//   {
//     id: 'stock',
//     disabled: false,
//     value: 0,
//     must: false,
//   },
// ]);
// const goodsInfoLabel: { [propsName: string]: string } = {
//   code: '条码',
//   name: '名称',
//   unit: '单位',
//   category: '种类',
//   price: '价格',
//   cost: '进货价',
//   stock: '库存',
// };
// #endregion
</script>

<template>
  <div class="list" @click="handleItemClick">
    <div
      class="list-item test-class"
      v-for="({ goodsCode, name, price }, index) in datalist"
      :key="index"
      :data-item="goodsCode"
    >
      <div class="item-name">{{ name }}</div>
      <div class="item-price">￥{{ price }}</div>
    </div>

    <div class="add-item list-item" data-item="add">
      <el-icon><Plus /></el-icon>
    </div>

    <GoodsInfoDialog
      v-if="showDialog_addItem"
      :visible="showDialog_addItem"
      @close-dialog="showDialog_addItem = false"
      @confirm-event="confirmAddGoods"
    ></GoodsInfoDialog>

    <!-- <el-dialog v-model="showDialog_addItem">
      <template #header>
        <div class="title">新建自定义商品</div>
      </template>

      <template #default>
        <div class="goods-info">
          <template
            v-for="({ id, disabled, value, must }, index) in goodsInfoArray"
          >
            <div :class="`goods-${id}`">
              <span v-if="must">*</span>
              <span class="description">{{ goodsInfoLabel[id] }}：</span>
              
              <template v-if="disabled">
                <span>{{ value }}</span>
              </template>
              <template v-else>
                <el-input v-model="goodsInfoArray[index].value" />
              </template>
            </div>
          </template>
        </div>

        <div class="goods-info">
          <div class="goods-code">
            <span class="description">条码：</span>
            <span>1000</span>
          </div>

          <div class="goods-name">
            <span class="description">名称：</span>
            <el-input v-model="goodsNameInput" />
          </div>
          <div class="goods-unit">
            <span class="description">单位：</span>
            <el-input v-model="goodsUnitInput" />
          </div>
          <div class="goods-category">
            <span class="description">分类：</span>
            <el-input v-model="goodsCategoryInput" />
          </div>
          <div class="goods-price">
            <span class="description">售价：</span>
            <el-input
              v-model="goodsPriceInput"
              @input="(input: string) => formatInput_number(input, 'price',2)"
            />
          </div>
          <div class="goods-cost">
            <span class="description">进货价：</span>
            <el-input
              v-model="goodsCostInput"
              @input="(input: string) => formatInput_number(input, 'cost',2)"
            />
          </div>
          <div class="goods-stock">
            <span class="description">库存：</span>
            <el-input
              v-model="goodsStockInput"
              @input="(input: string) => formatInput_number(input, 'stock')"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <el-button type="primary" plain @click="confirmModified"
          >确定</el-button
        >
      </template>
    </el-dialog> -->
  </div>
</template>

<style lang="less" scoped>
.list {
  display: grid;
  grid-template-columns: repeat(4, 24%);
  gap: 1%;
  box-sizing: border-box;

  .list-item {
    height: 100px;
    background: #fbfbfb;
    box-sizing: border-box;
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .item-name {
      width: 100%;
      height: 50px;
      //   min-height: 0;
      //   flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      word-break: break-all;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .item-price {
      color: #c2020c;
      height: 24px;
      //   flex-shrink: 0;
    }
  }
  .add-item {
    background: #f1f1f1;
    border: 2px dashed #ccc;
    border-radius: 2%;
    color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
  }
  :deep(.el-dialog) {
    @dialog_header_height: 50px;
    font-weight: 400;
    &__header {
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--pc-bg-color-red);
      margin-right: 0;
      padding: 0;
      padding-right: 10px;
      box-sizing: border-box;
      .el-dialog__headerbtn {
        top: 0;
      }
      .title {
        height: @dialog_header_height;
        line-height: @dialog_header_height;
        color: #e6e6e6;
        font-size: 18px;
      }
    }

    .goods-info {
      //   background: pink;
      padding: 10px 20px;
      box-sizing: border-box;
      width: 100%;
      display: grid;
      grid-template-columns: 50% 50%;
      gap: 0 5%;
      > [class^='goods-'] {
        @height: 60px;
        height: @height;
        width: 90%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        box-sizing: border-box;
        // border-bottom: 1px solid #ccc;
        .description {
          margin-right: 20px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .el-input {
          min-width: 200px;
        }
      }
    }
  }
}
</style>
