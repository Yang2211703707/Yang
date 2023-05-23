<!-- @format -->
<!-- 
    注意点：
    如果el-input组件外面还有其他组件, 就会导致autofocus失效。此时需手动调用 focus
 -->

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, toRefs } from 'vue';

import { keepDecimal } from '@/utils/number';

import type { cartItem } from '@/type/cart';
import { ElMessage, type ElInput } from 'element-plus';
interface emit {
  (e: 'confirmEvent', price: number, count: number, discount: number): void;
  (e: 'closeDialogEvent'): void;
}
type inputRef = InstanceType<typeof ElInput>;
interface modifiedRes {
  name: string;
  price: string;
  count: string | number;
  discount: string;
}
interface props {
  visible: boolean;
  item: cartItem;
}

const props = defineProps<props>();
const { visible, item } = toRefs(props);
const showDialog = ref(visible.value);

const modifiedRes: modifiedRes = reactive({
  name: item.value.name,
  price: item.value.temp_price.toString(),
  count: item.value.count,
  discount: item.value.discount.toString(),
});
const amount = computed(() => {
  const price = Number(modifiedRes.price);
  const count = Number(modifiedRes.count);
  const discount = Number(modifiedRes.discount);
  return keepDecimal(price * count * (discount / 100));
});

const priceInputRef = ref<inputRef>();
const countInputRef = ref<inputRef>();
const discountInputRef = ref<inputRef>();
const focusTarget = reactive([
  {
    target: 'price',
    state: false,
  },
  {
    target: 'count',
    state: false,
  },
  {
    target: 'discount',
    state: false,
  },
]);
// 页面进入后自动 focus priceInput
onMounted(async () => {
  await nextTick();
  priceInputRef.value!.focus();
  //   console.log(countInputRef);
});

const selectTarget = ref('price');
// 对应input focus 时全选
const handleFocus = (target: string) => {
  const index = focusTarget.findIndex((item) => item.target === target);
  console.log('focus!', target, index);

  //   focusTarget.forEach((item) => (item.state = false));
  focusTarget[index].state = true;

  if (target === 'price') {
    priceInputRef.value!.select();
    selectTarget.value = 'price';
  } else if (target === 'discount') {
    discountInputRef.value!.select();
    selectTarget.value = 'discount';
  }
};
// 失焦时，如果第一位是小数点，则补0。如果输入多个0，则值为0
const handleBlur = (target: string) => {
  focusTarget.forEach((item) => (item.state = false));
  selectTarget.value = '';

  if (target === 'price') {
    const price = modifiedRes.price;
    if (/^\./.test(price)) modifiedRes.price = '0'.concat(price);
    if (Number(price) === 0 || Number.isNaN(Number(price)))
      modifiedRes.price = '0';
  } else if (target === 'discount') {
    const discount = modifiedRes.discount;
    if (/^\./.test(discount)) modifiedRes.discount = '0'.concat(discount);
    if (Number(discount) === 0) modifiedRes.discount = '0';
  }
};
// 确保输入最多为两位小数
const handleInput = (target: string) => {
  console.log('handleInput!', target);
  if (target === 'price') {
    modifiedRes.price = modifiedRes.price
      .replace(/[^\d^\.]/g, '')
      .replace(/(\d*\.?\d{0,2})([\.\d]*)/, '$1');
  } else if (target === 'discount') {
    modifiedRes.discount = modifiedRes.discount
      .replace(/[^\d^\.]/g, '')
      .replace(/(\d*\.?\d{0,2})([\.\d]*)/, '$1');
  }
};
// cashier组件使用了preventDefault() 需手动聚焦以消除影响（直接点击无法聚焦）
const recoverDefault = (e: any) => {
  console.log(e.target!.focus());
};

// 数字软键盘事件处理
const handleNumberKeypadInput = (input: string) => {
  console.log('handleNumberKeypadInput收到值：', input);
  const index = focusTarget.findIndex((item) => item.state === true);
  if (index === 0) {
    if (selectTarget.value === 'price') {
      modifiedRes.price = input;
      selectTarget.value = '';
    } else modifiedRes.price += input;

    handleInput('price');
  } else if (index === 1) {
    if (true) {
      ElMessage.closeAll();
      ElMessage({
        message: '组件限制，暂不支持数字键盘输入和控制!',
        type: 'warning',
      });
    } else modifiedRes.count = Number(modifiedRes.count + input);
  } else if (index === 2) {
    if (selectTarget.value === 'discount') {
      modifiedRes.discount = input;
      selectTarget.value = '';
    } else modifiedRes.discount += input;
    handleInput('discount');
  } else {
    ElMessage.closeAll();
    ElMessage('当前无聚焦的输入框！输入无效');
  }
};
const handleClear = () => {
  console.log('clear!');
  const index = focusTarget.findIndex((item) => item.state === true);
  if (index === 0) modifiedRes.price = '';
  //   else if (index === 1) modifiedRes.count = 0;
  else if (index === 2) modifiedRes.discount = '';
  else {
    ElMessage.closeAll();
    ElMessage('当前无聚焦的输入框！输入无效');
  }
};
const handleDelete = () => {
  console.log('delete!');
  const index = focusTarget.findIndex((item) => item.state === true);
  if (index === 0) {
    const price = modifiedRes.price;
    modifiedRes.price = price.substring(0, price.length - 1);
  } else if (index === 1) {
    // const count = modifiedRes.count + '';
    // modifiedRes.count = Number(count.substring(0, count.length - 1));
  } else if (index === 2) {
    const discount = modifiedRes.discount;
    modifiedRes.discount = discount.substring(0, discount.length - 1);
  } else {
    ElMessage.closeAll();
    ElMessage('当前无聚焦的输入框！输入无效');
  }
};

const emit = defineEmits<emit>();
const handleConfirm = () => {
  console.log('handleConfirm!');
  emit(
    'confirmEvent',
    Number(modifiedRes.price),
    Number(modifiedRes.count),
    Number(modifiedRes.discount)
  );
};
const closeDialog = () => {
  emit('closeDialogEvent');
};
</script>

<template>
  <el-dialog
    v-model="showDialog"
    :title="item.name"
    align-center
    @close="closeDialog"
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
          @input="handleInput('price')"
          @focus="handleFocus('price')"
          @blur="handleBlur('price')"
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
          :max="9999"
          :value-on-clear="1"
          @focus="handleFocus('count')"
          @blur="handleBlur('count')"
        />
      </el-col>
      <el-col>
        折扣
        <el-input
          ref="discountInputRef"
          v-model="modifiedRes.discount"
          @input="handleInput('discount')"
          @focus="handleFocus('discount')"
          @blur="handleBlur('discount')"
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
        @input-event="handleNumberKeypadInput"
        @clear-event="handleClear"
        @delete-event="handleDelete"
        @mousedown.prevent
      ></number-keypad>
    </el-row>
  </el-dialog>
</template>

<style lang="less" scoped></style>
