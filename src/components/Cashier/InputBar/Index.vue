<!-- @format -->

<script setup lang="ts">
import TempGoods from '@/components/Cashier/InputBar/TheTempGoods.vue';

import { debounce, throttle } from '@/utils/function';

import { ref } from 'vue';
import { ElInput, ElMessage } from 'element-plus';

import { useGoodsStore } from '@/stores/goods';
import { useCartStore } from '@/stores/cart';

import type { baseCartItem } from '@/type/cart';

interface emit {
  (e: 'choose-result', datalist: baseCartItem[]): void;
  (e: 'empty-result'): void;
}
type inputRef = InstanceType<typeof ElInput>;

const emit = defineEmits<emit>();
const goodsStore = useGoodsStore();
const cartStore = useCartStore();
const inputValue = ref('');
function handleSearchRes() {
  console.log('handleSearchRes', inputValue.value);
  const val = inputValue.value;
  const len = inputValue.value.length;

  // 检测是否为纯数字
  if (/^[0-9]+$/g.test(val)) {
    if (len >= 4 && len <= 13) {
      const fuzzySearchRes = goodsStore.checkGoods(val);
      console.log('fuzzySearchRes', fuzzySearchRes);

      if (fuzzySearchRes.length === 0) {
        console.log('模糊匹配无结果');
        emit('empty-result');
        ElMessage.closeAll();
        ElMessage({
          message: '无匹配结果！如需添加新商品，请点击 全部功能 -- 新增商品 ！',
          type: 'warning',
        });
      } else if (fuzzySearchRes.length === 1) {
        const accurateSearchRes = goodsStore.checkGoods(val, 1);
        console.log('accurateSearchRes', accurateSearchRes);

        if (accurateSearchRes.length === 0) {
          console.log('模糊匹配到一个结果，但只是部分匹配');
          const itemList: baseCartItem[] = [
            {
              goodsCode: fuzzySearchRes[0].goodsCode,
              name: fuzzySearchRes[0].name,
              price: fuzzySearchRes[0].price,
            },
          ];

          emit('choose-result', itemList);
        } else {
          const { goodsCode, name, price, unit } = accurateSearchRes[0];
          const generatoredGoods = cartStore.cartItemGenerator({
            goodsCode,
            name,
            price,
            unit,
          });
          cartStore.addToCart(generatoredGoods);
          inputValue.value = '';

          emit('empty-result');
        }
      } else {
        console.log('模糊匹配到多个结果。。。', fuzzySearchRes);
        const itemList: baseCartItem[] = [];
        fuzzySearchRes.forEach((item) =>
          itemList.push({
            goodsCode: item.goodsCode,
            name: item.name,
            price: item.price,
          })
        );

        emit('choose-result', itemList);
      }
    } else if (len >= 16 && len <= 24) {
      console.log('可能为付款码');
      emit('empty-result');
    } else {
      console.log('未知数字码');
      emit('empty-result');
    }
  } else {
    console.log('非纯数字');
    emit('empty-result');
  }
}

const inputRef = ref<inputRef>();
function inputFocus() {
  if (inputRef.value) inputRef.value.focus();
}

const showDialog_tempGoods = ref(false);

defineExpose({ inputFocus });
</script>

<template>
  <el-row>
    <el-col :span="12">
      <el-input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        placeholder="输入关键字或条码，并以 Enter 键结束"
        clearable
        autofocus
        @mousedown="inputFocus"
        @input="debounce(handleSearchRes, 800)"
        @keydown.enter="handleSearchRes"
        @keyup="inputValue = inputValue.replace(/[^(\w|\u4e00-\u9fa5)]/g, '')"
      />
      <el-button @click="showDialog_tempGoods = true">临时商品</el-button>

      <TempGoods
        v-if="showDialog_tempGoods"
        @close="showDialog_tempGoods = false"
      ></TempGoods>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
@import '@/style/less/cashier.less';

.el-row {
  height: @inputBar_height;
  background-color: var(--pc-bg-color-white-1);
  padding-left: 20px;

  .el-col {
    display: flex;
    align-items: center;
    > :not(:last-child) {
      margin-right: 10px;
    }

    .el-input {
      box-sizing: border-box;
      border: 1px solid var(--pc-bg-color-red);
      border-radius: var(--el-input-border-radius);
      --el-input-focus-border-color: red;
      --el-input-border-color: var(--el-input-border-radius);
    }

    .el-button {
      background: var(--pc-bg-color-red);
      color: var(--pc-bg-color-white-1);
    }
  }
}
</style>
