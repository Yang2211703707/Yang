<!-- @format -->
<!-- 
    注意点：
    如果el-input组件外面还有其他组件, 就会导致autofocus失效。此时需手动调用 focus
 -->

<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';

import { keepDecimal } from '@/utils/number';
import { useComponentNotPrevent } from '../composible/comp-not-prevent';

import type { cartItem } from '@/type/cart';
import { ElInput, ElMessage } from 'element-plus';
import { usePageStateStore } from '@/stores/cashier-state';
import { storeToRefs } from 'pinia';

type inputRef = InstanceType<typeof ElInput>;
interface modifiedRes {
  name: string;
  price: string | number;
  count: string | number;
  discount: string | number;
}
interface emit {
  (e: 'update:visible', state: boolean): void;
  (e: 'confirmEvent', price: number, count: number, discount: number): void;
  (e: 'closeDialogEvent'): void;
}
interface props {
  visible: boolean;
  item: modifiedRes;
}

const props = defineProps<props>();
const { visible, item } = toRefs(props);
const showDialog = ref(visible.value || false);
const emit = defineEmits<emit>();
watch(showDialog, (newState) => {
  if (newState) emit('update:visible', true);
  else emit('update:visible', false);
});
useComponentNotPrevent();

// const { cashier_preventDefault } = storeToRefs(usePageStateStore());
// onMounted(() => (cashier_preventDefault.value = false));
// onUnmounted(() => (cashier_preventDefault.value = true));

// 保存修改值
const modifiedRes: modifiedRes = reactive({
  name: props.item.name,
  price: props.item.price + '',
  count: Number(props.item.count),
  discount: props.item.discount + '',
});
const amount = computed((): number => {
  const price = Number(modifiedRes.price);
  const count = Number(modifiedRes.count);
  const discount = Number(modifiedRes.discount);
  return keepDecimal(price * count * (discount / 100));
});

const priceInputRef = ref<inputRef | null>(null);
const countInputRef = ref<inputRef | null>(null);
const discountInputRef = ref<inputRef | null>(null);
function formatPriceInput(input: string, decimal = 2) {
  const reg1 = new RegExp(`(\\d*\\.?\\d{0,${decimal}})([\\.\\d]*)`);
  modifiedRes.price = input.replace(/[^\d^\.]/g, '').replace(reg1, '$1');
}
function formatDiscountInput(input: string) {
  modifiedRes.discount = input.replace(/[^\d]/g, '');
  if (Number(modifiedRes.discount) > 100) modifiedRes.discount = '100';
  if (Number(modifiedRes.discount) < 0) modifiedRes.discount = '0';
}

function handleConfirm() {
  console.log('handleConfirm!');
  emit(
    'confirmEvent',
    Number(modifiedRes.price),
    Number(modifiedRes.count),
    Number(modifiedRes.discount)
  );
}

const focusList = reactive([
  {
    target: 'price',
    state: false,
  },
  ,
  {
    target: 'count',
    state: false,
  },
  {
    target: 'discount',
    state: false,
  },
]);
onMounted(async () => {
  await nextTick();
  priceInputRef.value && priceInputRef.value.focus();
});
function handleInput(input: string) {
  console.log('handleInput', input);
}
function handleClear() {}
function handleDelete() {}
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
      <el-col>
        现价
        <el-input
          ref="priceInputRef"
          v-model="modifiedRes.price"
          @input="formatPriceInput"
        >
          <template #prefix>￥</template>
          <template #suffix>元</template>
        </el-input>
      </el-col>

      <el-col>
        数量
        <el-input-number
          ref="countInputRef"
          v-model="modifiedRes.count"
          :min="1"
          :max="999"
          :value-on-clear="1"
        />
      </el-col>

      <el-col>
        折扣
        <el-input
          ref="discountInputRef"
          v-model="modifiedRes.discount"
          @input="formatDiscountInput"
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
        @confirm-event="handleConfirm"
        @input-event="handleInput"
        @clear-event="handleClear"
        @delete-event="handleDelete"
        @mousedown.prevent
      ></number-keypad>
    </el-row>
  </el-dialog>
</template>

<style lang="less" scoped></style>
