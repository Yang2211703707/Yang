<!-- @format -->

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';

import { ArrowLeft, Search } from '@element-plus/icons';
import type { ElInput } from 'element-plus';
import type { mode } from '@/type/search';

interface props {
  searchValue: string;
  selectValue: string;
}
interface emit {
  (event: 'update:searchValue', value: string): void;
  (event: 'update:selectValue', value: string): void;
}

const props = defineProps<props>();
const emit = defineEmits<emit>();

// 右边
// 排序方式
const options = [
  {
    value: 'default-sort',
    label: '默认排序',
  },
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

// 搜索关键词
const inputRef = ref<InstanceType<typeof ElInput>>();
const handleFocus = (e: any) => {
  console.log(e);
  e.currentTarget.select();
};
const handleClear = () => {
  inputRef.value!.focus(); // ! 表示向 ts 声明此元素确定存在
};

onMounted(() => {
  inputRef.value!.focus();
});
</script>

<template>
  <div class="goods-header">
    <div class="left"></div>

    <div class="right">
      <div class="search">
        <el-input
          ref="inputRef"
          v-model="searchValue"
          placeholder="输入商品码或名称进行检索"
          clearable
          autofocus
          @change="(value:string) => emit('update:searchValue', value)"
          @focus="handleFocus"
          @clear="handleClear"
        >
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="select">
        <el-select
          v-model="selectValue"
          placeholder="Select"
          @change="(value:mode) => emit('update:selectValue', value)"
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

<!-- <template>
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
</template> -->

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
