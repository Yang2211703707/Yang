<!-- @format -->
<!-- 
    注意点：
    如果el-input组件外面还有其他组件, 就会导致autofocus失效。此时需手动调用 focus
 -->

<script setup lang="ts">
import NumberKeypad from '@/components/Common/NumberKeypad.vue';
import { ElInput } from 'element-plus';

import { reactive, ref, toRefs } from 'vue';

// 组合式函数相关
import { useComponentNotPrevent } from '../composible/comp-not-prevent';
import { useModifiedRes } from './var-modifiedRes';
import { useDialog } from './var-showDialog';
import { useHandleInputComp } from './useInputComp';
import { useKeypad } from './useKeypad';

import type { modifiedRes, inputRef, focusList } from '../type/price-dialog';

interface props {
  visible: boolean;
  item: modifiedRes;
}
interface emit {
  (e: 'update:visible', state: boolean): void;
  (e: 'confirmEvent', price: number, count: number, discount: number): void;
  (e: 'closeDialogEvent'): void;
}

// 初始化页面状态及配置
const props = defineProps<props>();
const { visible, item } = toRefs(props);
const emit = defineEmits<emit>();
useComponentNotPrevent();

// 本组件基本变量相关
const { showDialog } = useDialog(visible.value, emit);
const { modifiedRes, amount } = useModifiedRes(props.item);
function handleConfirm() {
  emit(
    'confirmEvent',
    Number(modifiedRes.price),
    Number(modifiedRes.count),
    Number(modifiedRes.discount)
  );
}

// 价格，数量，折扣 Input 相关
const priceInputRef = ref<inputRef | null>(null);
const countInputRef = ref<inputRef | null>(null);
const discountInputRef = ref<inputRef | null>(null);
const focusList: focusList[] = reactive([
  {
    target: 'price',
    state: false,
    reset: false,
  },
  {
    target: 'count',
    state: false,
    reset: false,
  },
  {
    target: 'discount',
    state: false,
    reset: false,
  },
]);
const {
  focusInput,
  formatPrice,
  onPriceInput,
  onPriceInputFocus,
  onPriceInputBlur,
  formatCount,
  formatDiscount,
  onDiscountInput,
  onDiscountInputFocus,
  onDiscountInputBlur,
} = useHandleInputComp({
  priceInputRef,
  countInputRef,
  discountInputRef,
  modifiedRes,
  focusList,
});

const { disableTargetList, handleNumKeypadInput, handleDelete, handleClear } =
  useKeypad({
    focusList,
    modifiedRes,
    formatPrice,
    formatCount,
    formatDiscount,
  });
</script>

<template>
  <el-dialog
    v-model="showDialog"
    :title="item.name"
    align-center
    @close="emit('update:visible', false)"
    @keyup.enter="handleConfirm"
  >
    <el-row class="row-1">
      <el-col>
        原价<span class="price">￥{{ item.price }}</span>
      </el-col>
    </el-row>

    <el-row class="row-2">
      <el-col @click="focusInput('price')">
        现价
        <el-input
          ref="priceInputRef"
          v-model="modifiedRes.price"
          @input="onPriceInput"
          @focus="
            () => {
              onPriceInputFocus();
              disableTargetList = ['percent'];
            }
          "
          @blur="onPriceInputBlur"
        >
          <template #prefix>￥</template>
          <template #suffix>元</template>
        </el-input>
      </el-col>

      <el-col @click="focusInput('count')">
        数量
        <el-input-number
          ref="countInputRef"
          v-model="modifiedRes.count"
          :min="1"
          :max="999"
          :value-on-clear="1"
          @input="formatCount"
          @focus="focusList[1].state = true"
          @blur="focusList[1].state = false"
        />
      </el-col>

      <el-col @click="focusInput('discount')">
        折扣
        <el-input
          ref="discountInputRef"
          v-model="modifiedRes.discount"
          @input="onDiscountInput"
          @focus="
            () => {
              onDiscountInputFocus();
              disableTargetList = ['percent', '.'];
            }
          "
          @blur="onDiscountInputBlur"
        >
          <template #suffix>%</template>
        </el-input>
      </el-col>

      <el-col class="total">
        小计 <span>￥</span>{{ amount }}<span class="unit">元</span>
      </el-col>
    </el-row>

    <el-row class="row-3">
      <number-keypad
        :disable-target="disableTargetList"
        @confirm-event="handleConfirm"
        @input-event="handleNumKeypadInput"
        @clear-event="handleClear"
        @delete-event="handleDelete"
        @mousedown.prevent
      ></number-keypad>
    </el-row>
  </el-dialog>
</template>

<style lang="less" scoped></style>
