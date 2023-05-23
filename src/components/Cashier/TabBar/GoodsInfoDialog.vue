<!-- @format -->

<script setup lang="ts">
import { computed, inject, reactive, ref, toRefs, watchEffect } from 'vue';

import type { goodsItem } from '@/type/goods';
import { useGoodsStore } from '@/stores/goods';
import { ElMessage } from 'element-plus';

interface props {
  visible: boolean;
}
interface emit {
  (e: 'confirmEvent', modifiedRes: goodsItem): void;
  (e: 'closeDialog'): void;
}

const props = defineProps<props>();
const { visible } = toRefs(props);
const showDialog = ref(false);
watchEffect(() => (showDialog.value = visible.value));

const emit = defineEmits<emit>();
const closeDialog = () => {
  emit('closeDialog');
};

const { goodsCodeGenerator } = useGoodsStore();
const goodsCode = goodsCodeGenerator();
const goodsNameInput = ref('');
const goodsUnitInput = ref('');
const goodsCategoryInput = ref('');
const goodsPriceInput = ref<string | number>(0);
const goodsCostInput = ref<string | number>(0);
const goodsStockInput = ref<string | number>(0);

const confirmModified = () => {
  const modifiedRes: goodsItem = {
    goodsCode: goodsCode,
    name: goodsNameInput.value,
    unit: goodsUnitInput.value,
    category: goodsCategoryInput.value,
    price: Number(goodsPriceInput.value),
    cost: Number(goodsCostInput.value),
    stock: Number(goodsStockInput.value),
    creatTime: new Date().getTime(),
  };
  console.log(modifiedRes);

  const price = Number(modifiedRes.price);
  if (modifiedRes.name.trim() == '') ElMessage('名字不能为空！');
  else if (price === 0) ElMessage('价格不能为0！');
  else if (price !== price) ElMessage('价格输入异常！');
  else emit('confirmEvent', modifiedRes);
};

const formatTypeToNumber = (
  input: string,
  target: 'goodsCode' | 'price' | 'cost' | 'stock',
  decimal: number = 0
) => {
  console.log('formatTypeToNumber', input);

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

  if (target === 'price') goodsPriceInput.value = replaceRes;
  else if (target === 'cost') goodsCostInput.value = replaceRes;
  else if (target === 'stock') goodsStockInput.value = replaceRes;
};
</script>

<template>
  <div class="goods-info-modify">
    <el-dialog v-model="showDialog" title="新增商品" @close="closeDialog">
      <div class="goods-info">
        <div class="goods-code">
          <span class="description">条码：</span>
          <div>{{ goodsCode }}</div>
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
            @input="(input: string) => formatTypeToNumber(input, 'price', 2)"
          />
        </div>
        <div class="goods-cost">
          <span class="description">成本价：</span>
          <el-input
            v-model="goodsCostInput"
            @input="(input: string) => formatTypeToNumber(input, 'cost', 2)"
          />
        </div>
        <div class="goods-stock">
          <span class="description">库存：</span>
          <el-input
            v-model="goodsStockInput"
            @input="(input: string) => formatTypeToNumber(input, 'stock')"
          />
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" plain @click="confirmModified"
            >确定</el-button
          >
        </span>
      </template>
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
