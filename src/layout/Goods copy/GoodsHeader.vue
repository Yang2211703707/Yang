<!-- @format -->

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, type Ref } from 'vue';

import { ArrowLeft, Search } from '@element-plus/icons';
import type { ElInput } from 'element-plus';

type mode =
  | 'order-sort'
  | 'reverse-sort'
  | 'time-sort'
  | 'name-sort'
  | 'price-sort';
interface emit {
  (event: 'sendSelectValue', mode: mode): void;
  (event: 'sendSearchValue', val: string): void;
}
const emit = defineEmits<emit>();
const options = [
  {
    value: 'order-sort',
    label: '顺序排序',
  },
  {
    value: 'reverse-sort',
    label: '倒序排序',
  },
  {
    value: 'time-sort',
    label: '按时间排序',
  },
  {
    value: 'name-sort',
    label: '按名称排序',
  },
  {
    value: 'price-sort',
    label: '按售价排序',
  },
];

// const input: Ref<HTMLInputElement | null> = ref(null);
const inputRef = ref<InstanceType<typeof ElInput>>();
const searchValue = ref('');
onMounted(() => {
  inputRef.value!.focus();
});

const handleInput = (val: string) => {
  emit('sendSearchValue', val);
};
const handleFocus = (e: any) => {
  console.log(e);
  e.currentTarget.select();
};
const handleClear = () => {
  inputRef.value!.focus(); // ! 表示向 ts 声明此元素确定存在
};
const selectValue = ref('order-sort');
const handleSelect = (mode: mode) => {
  emit('sendSelectValue', mode);
};
</script>

<template>
  <div class="goods-header">
    <div class="left">
      <el-icon><ArrowLeft /></el-icon>
    </div>

    <div class="right">
      <div class="search">
        <el-input
          ref="inputRef"
          v-model="searchValue"
          placeholder="输入商品码或名称进行检索"
          clearable
          autofocus
          @change="handleInput"
          @focus="handleFocus"
          @clear="handleClear"
        >
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="select">
        <span>筛选：</span>
        <el-select
          v-model="selectValue"
          placeholder="Select"
          @change="handleSelect"
        >
          <el-option
            v-for="{ value, label } in options"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '@/style/less/goods.less';

.goods-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  //   height: @goods_header_height;
  height: 100%;

  .left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    & > *:not(:last-child) {
      margin-right: 20px;
    }

    .search {
      .el-input {
        width: 250px;
      }
    }
    .select {
      .el-select {
        width: 150px;
      }
    }
  }
}
</style>
