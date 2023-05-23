<!-- @format -->

<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { usePageStateStore } from '@/stores/cashier-state';
import { useGoodsStore } from '@/stores/goods';

import { Plus } from '@element-plus/icons';
import { storeToRefs } from 'pinia';
import { reactive, ref, watchEffect } from 'vue';

import type { baseCartItem } from '@/type/cart';
import type { goodsItem } from '@/type/goods';

interface emit {
  (e: 'item-click-event', goodsCode: string): void;
}
interface props {
  data: baseCartItem[];
}

const props = defineProps<props>();
const datalist: baseCartItem[] = reactive(props.data || []);
if (!datalist.find((item) => item.goodsCode === '1008'))
  datalist.push({
    goodsCode: '1008',
    price: 2.33,
    name: '测试商品_1008',
  });

const { cashier_preventDefault } = storeToRefs(usePageStateStore());
const showDialog_addItem = ref(false);
watchEffect(() => {
  if (showDialog_addItem.value) cashier_preventDefault.value = false;
  else cashier_preventDefault.value = true;
});

const { goodsGenerator, addToGoodsList, findToGoodsList } = useGoodsStore();
function confirmAddGoods(goodsInfo: goodsItem) {
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
}

const emit = defineEmits<emit>();
const listRef = ref<HTMLElement | null>(null);
const { cartItemGenerator, addToCart } = useCartStore();
function handleItemClick(e: MouseEvent) {
  const el = e.target as HTMLElement;
  const itemClassName = 'list-item';
  const itemDataset = 'data-item';
  const parentClassName = 'list';
  let dataItem = '';

  if (el.matches(`.${parentClassName}`)) return;
  else if (el.classList.value.includes(itemClassName)) {
    if (el.hasAttribute(itemDataset)) {
      if (el.dataset.item) dataItem = el.dataset.item;
      else console.log(`读取 ${itemDataset} 异常！请检查触发事件的元素属性！`);
    }
  } else if (el.parentElement) {
    let parentEl: HTMLElement | null = el.parentElement;

    while (parentEl && !parentEl.matches(`.${parentClassName}`)) {
      console.log(
        'parentEl: ',
        parentEl,
        parentEl.classList.value,
        parentEl.dataset
      );

      if (parentEl.classList.value.includes(itemClassName)) {
        console.log('@@@@', parentEl, parentEl.dataset);
        if (parentEl.dataset.item) dataItem = parentEl.dataset.item;
      }

      if (parentEl == listRef.value) {
        parentEl = null;
        break;
      } else parentEl = parentEl.parentElement;
    }
  }

  console.log('dataItem', dataItem);

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
      console.log(findGoodsRes, newCartItem);
      addToCart(newCartItem);
      emit('item-click-event', dataItem);
    }
  } else if (dataItem === 'add') showDialog_addItem.value = true;
}
</script>

<template>
  <div class="list" ref="listRef" @click="handleItemClick">
    <div
      class="list-item"
      v-for="({ goodsCode, name, price }, index) in datalist"
      :key="index"
      :data-item="goodsCode"
    >
      <div class="item-name">{{ name }}</div>
      <div class="item-goods-code">{{ goodsCode }}</div>
      <div class="item-price">￥{{ price }}</div>
    </div>

    <div class="item-add list-item" data-item="add">
      <el-icon><Plus /></el-icon>
    </div>

    <GoodsInfoDialog
      v-if="showDialog_addItem"
      :visible="showDialog_addItem"
      @close-dialog="showDialog_addItem = false"
      @confirm-event="confirmAddGoods"
    ></GoodsInfoDialog>
  </div>

  <div>tabbar's new content...</div>
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
    // justify-content: space-between;
    font-size: 16px;

    .item-name {
      flex-shrink: 0;
      width: 100%;
      height: 45px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      word-break: break-all;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .item-goods-code {
      flex: 1;
      color: #aaa;
      font-size: 14px;
      font-weight: 400;
    }
    .item-price {
      flex-shrink: 0;
      color: #c2020c;
      height: 25px;
      font-size: 18px;
    }
  }

  .item-add {
    background: #f1f1f1;
    border: 2px dashed #ccc;
    border-radius: 2%;
    color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
  }
}
</style>
