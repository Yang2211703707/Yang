<!-- @format -->

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watchEffect, type Ref } from 'vue';

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

// 左边
// 日期时间选择器
const date = new Date();
const defaultTime = [
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
];
const dateValue = ref<Date[]>([]);
const shortcuts = [
  {
    text: '今天',
    value: () => {
      const _date = new Date();
      const year = _date.getFullYear();
      const month = _date.getMonth();
      const date = _date.getDate();
      const start = new Date(year, month, date, 0, 0, 0);
      const end = new Date(year, month, date, 23, 59, 59);
      return [start, end];
    },
  },
  {
    text: '昨天',
    value: () => {
      const _date = new Date();
      const year = _date.getFullYear();
      const month = _date.getMonth();
      const date = _date.getDate();
      const start = new Date(year, month, date - 1, 0, 0, 0);
      const end = new Date(year, month, date - 1, 23, 59, 59);
      return [start, end];
    },
  },
  {
    text: '近三天',
    value: () => {
      const _date = new Date();
      const year = _date.getFullYear();
      const month = _date.getMonth();
      const date = _date.getDate();
      const start = new Date(year, month, date - 3, 0, 0, 0);
      const end = new Date(year, month, date, 23, 59, 59);
      return [start, end];
    },
  },
  {
    text: '上周',
    value: () => {
      const _date = new Date();
      const year = _date.getFullYear();
      const month = _date.getMonth();
      const date = _date.getDate();
      const start = new Date(year, month, date - 7, 0, 0, 0);
      const end = new Date(year, month, date, 23, 59, 59);
      return [start, end];
    },
  },
  {
    text: '一个月',
    value: () => {
      const _date = new Date();
      const year = _date.getFullYear();
      const month = _date.getMonth();
      const date = _date.getDate();
      const start = new Date(year, month - 1, date, 0, 0, 0);
      const end = new Date(year, month - 1, date, 23, 59, 59);
      return [start, end];
    },
  },
  {
    text: '三个月',
    value: () => {
      const _date = new Date();
      const year = _date.getFullYear();
      const month = _date.getMonth();
      const date = _date.getDate();
      const start = new Date(year, month - 3, date, 0, 0, 0);
      const end = new Date(year, month, date, 23, 59, 59);
      return [start, end];
    },
  },
];

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

onMounted(() => (dateValue.value = defaultTime));
watchEffect(() => {
  console.log(dateValue.value);
});
</script>

<template>
  <div class="goods-header">
    <div class="left">
      <el-date-picker
        v-model="dateValue"
        type="datetimerange"
        format="YYYY/MM/DD HH:mm:ss"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        range-separator="/"
        :shortcuts="shortcuts"
      />
    </div>

    <div class="right">
      <div class="search">
        <el-input
          v-model="searchValue"
          placeholder="输入商品码或名称进行检索"
          clearable
          autofocus
          @change="handleInput"
          @focus="handleFocus"
          @clear="handleClear"
          ref="inputRef"
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
.goods-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
