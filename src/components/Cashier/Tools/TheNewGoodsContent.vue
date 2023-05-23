<!-- @format -->

<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons';

import { nextTick, onMounted, ref } from 'vue';

import { ElMessage, type ElInput } from 'element-plus';
type inputCompRef = InstanceType<typeof ElInput>;

const goodsCode = ref<string>('');
const goodsName = ref<string>('');
const goodsUnit = ref<string>('');
const goodsCategory = ref<string>('');
const goodsPrice = ref<string>('0');
const goodsCost = ref<string>('0');
const goodsStock = ref<string>('0');
const goodsCodeInputRef = ref<inputCompRef>();

function formatGoodsCode() {
  goodsCode.value = goodsCode.value.replace(/[^\d]/g, '');
  if (goodsCode.value.length > 15) {
    ElMessage.closeAll();
    ElMessage({
      message: '超过最大位数限制！',
      type: 'warning',
    });
    goodsCode.value = goodsCode.value.slice(0, 15);
  }
}
function inputToTwoDecimal(num: string) {
  return num.replace(/[^\d\.]/g, '').replace(/(\d*\.?\d{0,2})([\.\d]*)/, '$1');
}
function formatGoodsStock(num: string) {
  //   return num
  //     .replace(/[^\d\-\.]/g, '')
  //     .replace(/(-?\d*\.?\d{0,2})([\d\-\.]*)/, '$1');
  return num.replace(/[^\-\d]/g, '').replace(/(-?\d*)([\-\d]*)/, '$1');
}

defineExpose({
  goodsCode,
  goodsName,
  goodsUnit,
  goodsCategory,
  goodsPrice,
  goodsCost,
  goodsStock,
});
const showMore = ref(false);

onMounted(() => {
  nextTick(() => goodsCodeInputRef.value?.focus());
});
</script>

<template>
  <div class="container">
    <h3 class="title">必填信息</h3>
    <div class="content">
      <div class="item">
        <i class="required-flag">*</i>
        <span class="description">条码：</span>
        <el-input
          v-model="goodsCode"
          @input="formatGoodsCode"
          ref="goodsCodeInputRef"
        ></el-input>
      </div>

      <div class="item">
        <i class="required-flag">*</i>
        <span class="description">名称：</span>
        <el-input v-model="goodsName"></el-input>
      </div>

      <div class="item">
        <i class="required-flag">*</i>
        <span class="description">售价：</span>
        <el-input
          v-model="goodsPrice"
          @input="goodsPrice = inputToTwoDecimal(goodsPrice)"
          @blur="goodsPrice = Number(goodsPrice) + ''"
        ></el-input>
      </div>
    </div>

    <h3 class="title">
      <span>更多信息</span>
      <el-icon @click="showMore = !showMore">
        <template v-if="showMore">
          <ArrowUp></ArrowUp>
        </template>
        <template v-else>
          <ArrowDown></ArrowDown>
        </template>
      </el-icon>
    </h3>
    <div class="content" v-if="showMore">
      <div class="item">
        <span class="description">种类：</span>
        <el-input v-model="goodsCategory"></el-input>
      </div>

      <div class="item">
        <span class="description">单位：</span>
        <el-input v-model="goodsUnit"></el-input>
      </div>

      <div class="item">
        <span class="description">进价：</span>
        <el-input
          v-model="goodsCost"
          @input="goodsCost = inputToTwoDecimal(goodsCost)"
          @blur="goodsCost = Number(goodsCost) + ''"
        ></el-input>
      </div>

      <div class="item">
        <span class="description">库存：</span>
        <el-input
          v-model="goodsStock"
          @input="goodsStock = formatGoodsStock(goodsStock)"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@item_height: 50px;

.container {
  .title {
    &:not(:first-child) {
      margin-top: 20px;
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }
  .content {
    padding: 10px 20px;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 48% 48%;
    gap: 0 4%;

    .item {
      width: 95%;
      height: @item_height;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      .required-flag {
        position: absolute;
        top: 33%;
        left: -12px;
        color: red;
        font-size: 1.2em;
      }

      .description {
        flex-shrink: 0;
      }

      //   :deep(input::-webkit-outer-spin-button),
      //   :deep(input::-webkit-inner-spin-button) {
      //     -webkit-appearance: none !important;
      //   }
      //   :deep(input[type='number']) {
      //     line-height: 1;
      //     -moz-appearance: textfield !important;
      //     appearance: textfield !important;
      //   }
    }
  }
}
</style>
