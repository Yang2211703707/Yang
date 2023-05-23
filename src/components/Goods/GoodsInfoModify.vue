<!-- @format -->

<script setup lang="ts">
import { computed, reactive, ref, toRefs, watchEffect } from 'vue';

import type { goodsItem } from '@/type/goods';
import { timestampToTime } from '@/utils/time';

interface props {
  visible: boolean;
  goodsInfo: goodsItem;
}
interface emit {
  (e: 'closeDialog'): void;
  (e: 'confirmEvent', modifiedRes: goodsItem): void;
  (e: 'deleteGoods', goodsCode: string): void;
}

const props = defineProps<props>();
const { visible, goodsInfo } = toRefs(props);
const emit = defineEmits<emit>();

const goodsCodeInput = ref(goodsInfo.value.goodsCode);
const goodsNameInput = ref(goodsInfo.value.name);
const goodsUnitInput = ref(goodsInfo.value.unit);
const goodsCategoryInput = ref(goodsInfo.value.category);
const goodsPriceInput = ref<string | number>(goodsInfo.value.price);
const goodsCostInput = ref<string | number>(goodsInfo.value.cost);
const goodsStockInput = ref<string | number>(goodsInfo.value.stock);
const goodsCreateTime = computed(() =>
  timestampToTime(goodsInfo.value.creatTime)
);
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

const confirmModified = () => {
  const modifiedRes: goodsItem = {
    goodsCode: goodsCodeInput.value,
    name: goodsNameInput.value,
    unit: goodsUnitInput.value,
    category: goodsCategoryInput.value,
    price: Number(goodsPriceInput.value),
    cost: Number(goodsCostInput.value),
    stock: Number(goodsStockInput.value),
    creatTime: goodsInfo.value.creatTime,
  };
  console.log(modifiedRes);
  emit('confirmEvent', modifiedRes);
};

const handleConfirmDelete = () => {
  showDeleteConfirm.value = false;
  emit('deleteGoods', goodsCodeInput.value);
};

const showDeleteConfirm = ref(false);
</script>

<template>
  <div class="goods-info-modify">
    <el-dialog
      v-model="visible"
      title="编辑商品信息"
      @close="emit('closeDialog')"
    >
      <p>创建时间：{{ goodsCreateTime }}</p>

      <div class="goods-info">
        <div class="goods-code">
          <span class="description">条码：</span>
          <el-input
            v-model="goodsCodeInput"
            @input="goodsCodeInput = goodsCodeInput.replace(/[^\d]/g, '')"
          />
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
          <span class="description">成本价：</span>
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

      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" plain @click="showDeleteConfirm = true"
            >删除本商品</el-button
          >
          <el-button type="primary" plain @click="confirmModified"
            >确定</el-button
          >
        </span>
      </template>

      <el-dialog
        v-model="showDeleteConfirm"
        width="30%"
        title="确定要删除本商品吗?"
        append-to-body
        align-center
      >
        <template #footer>
          <el-button plain @click="showDeleteConfirm = false">取消</el-button>
          <el-button type="primary" plain @click="handleConfirmDelete"
            >确定</el-button
          >
        </template>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.goods-info-modify {
  user-select: none;
  :deep(.el-dialog) {
    &__header {
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--pc-bg-color-red);
      margin-right: 0;
      padding: 0;
      padding-right: 10px;
      box-sizing: border-box;
      height: 50px;
      .el-dialog__title {
        color: #e6e6e6;
      }
      .el-dialog__headerbtn {
        top: 0;
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
