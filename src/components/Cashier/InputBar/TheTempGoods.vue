<!-- @format -->

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue';

import { ElMessage, type ElInput } from 'element-plus';
import { useCartStore } from '@/stores/cart';

interface emit {
  (e: 'close'): void;
}
interface item {
  label: string;
  id: string;
  value: string;
}

const emit = defineEmits<emit>();
const visible = ref(true);
watch(visible, (newState) => {
  if (!newState) emit('close');
});

const numList: item[] = reactive([
  { label: '1', id: 'num_1', value: '1' },
  { label: '2', id: 'num_2', value: '2' },
  { label: '3', id: 'num_3', value: '3' },
  { label: '4', id: 'num_4', value: '4' },
  { label: '5', id: 'num_5', value: '5' },
  { label: '6', id: 'num_6', value: '6' },
  { label: '7', id: 'num_7', value: '7' },
  { label: '8', id: 'num_8', value: '8' },
  { label: '9', id: 'num_9', value: '9' },
  { label: '.', id: 'char_point', value: 'point' },
  { label: '0', id: 'num_0', value: '0' },
  { label: 'x', id: 'char_del', value: 'del' },
]);

const inputValue = ref('');
const inputRef = ref<InstanceType<typeof ElInput> | null>(null);
watch(inputValue, (newVal) => {
  inputValue.value = newVal
    .replace(/[^\d^\.]/g, '')
    .replace(/(\d*\.?\d{0,2})([\d\.]*)/, '$1');
});
onMounted(async () => {
  await nextTick();
  if (inputRef.value) inputRef.value.focus();
});
function handleNumKeyboardClick(item: string) {
  if (!Number.isNaN(Number(item))) inputValue.value += item;
  else
    switch (item) {
      case 'del':
        inputValue.value = inputValue.value.slice(
          0,
          inputValue.value.length - 1
        );
        break;
      case 'point':
        inputValue.value += '.';
        break;
    }
}
{
  goodsCode: `tempgoods_${inputValue.value}`;
}
const { addToCart, cartItemGenerator } = useCartStore();
function confirmAddGoods() {
  visible.value = false;

  let val = inputValue.value;
  if (Number(val) === 0 || Number.isNaN(Number(val))) {
    ElMessage.closeAll();
    ElMessage({
      type: 'warning',
      message: '输入的价格有误！请检查价格输入',
    });
    return;
  }

  val = Number(val).toFixed(2);
  addToCart(
    cartItemGenerator({
      goodsCode: `tempgoods_${val}`,
      price: Number(val),
      name: `临时商品_${val}元`,
    })
  );
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="临时商品"
    width="25%"
    append-to-body
    align-center
    @mousedown.prevent
    @keydown.enter="confirmAddGoods"
  >
    <div class="header">
      <el-input
        v-model="inputValue"
        ref="inputRef"
        placeholder="请输入价格"
      ></el-input>
    </div>

    <div class="number-keyboard">
      <div
        v-for="{ label, id, value } in numList"
        :key="id"
        @click="handleNumKeyboardClick(value)"
      >
        <div class="item">{{ label }}</div>
      </div>
    </div>

    <div class="footer">
      <el-button size="large" @click="confirmAddGoods">添加</el-button>
    </div>
  </el-dialog>
</template>

<style lang="less" scoped>
@border: 1px solid #ccc;
@item_h: 75px;

.header {
  padding: 10px 20px 10px 5px;
  height: @item_h;
  display: flex;
  align-items: center;
  .el-input {
    height: 40px;
  }
}
.number-keyboard {
  width: 100%;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(3, 1fr);
  user-select: none;
  box-sizing: border-box;
  border-top: @border;

  .item {
    height: @item_h;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: @border;
    border-bottom: @border;
  }
}

.footer {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-button {
    background: var(--pc-bg-color-red);
    color: #e6e6e6;
    width: 20%;
  }
}
</style>
