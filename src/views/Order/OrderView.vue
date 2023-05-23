<!-- @format -->

<script setup lang="ts">
import OrderHeader from './layout/OrderHeader.vue';
import OrderMain from './layout/OrderMain.vue';

import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useOrderStore } from '@/stores/order';

import type { mode } from '@/type/search';

interface filterTradingRules {
  text: string;
  value: string;
}

// header 相关
const selectValue = ref<mode>('default-sort');
const searchValue = ref<string>('');

// main 相关
const { orderList } = storeToRefs(useOrderStore());
const filteredValue = ref<string[]>([]);
const datalist = computed(() => {
  let finalResult = orderList.value;

  // 根据搜索模式确定数据的排列方式
  if (selectValue.value === 'reverse-sort')
    finalResult = finalResult.slice().reverse();

  if (filteredValue.value.length > 0)
    finalResult = finalResult.filter((item) =>
      filteredValue.value.includes(item.trading)
    );

  // 根据搜索关键词匹配对应数据
  if (searchValue.value !== '')
    finalResult = finalResult.filter(
      (order) =>
        order.orderCode.includes(searchValue.value) ||
        order.payment.toString().includes(searchValue.value)
    );

  return finalResult;
});
const filterTradingRules = computed(() => {
  let filterResult: filterTradingRules[] = [];
  orderList.value
    .reduce(
      (pre: string[], cur) =>
        pre.includes(cur.trading) ? pre : pre.concat(cur.trading),
      []
    )
    .forEach((item) =>
      filterResult.push({
        text: item,
        value: item,
      })
    );

  return filterResult;
});
const updateFilterRules = (rulesArr: string[]) => {
  console.log('updateFilterRules', rulesArr);
  filteredValue.value = rulesArr;
};

// footer 相关
// goodsList的分页配置
const currentPage = ref(1);
const pageSize = ref(30);
const background = ref(true);
const pagerCount = ref(9); // 只接受 5~21 的奇数
const handleCurrentChange = (e: any) => {
  console.log('handleCurrentChange', e);
};
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
</script>

<template>
  <div class="order-pages">
    <order-header
      v-model:searchValue="searchValue"
      v-model:selectValue="selectValue"
    ></order-header>

    <order-main
      :datalist="
        datalist.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      :filterRules1="filterTradingRules"
      @updateFilterRules="updateFilterRules"
    ></order-main>

    <el-pagination
      layout="sizes, prev, pager, next, jumper, total"
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :total="datalist.length"
      :pager-count="pagerCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-show="datalist.length > 0"
    />
  </div>
</template>

<style lang="less" scoped>
@import '@/style/less/goods.less';

.order-pages {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  //   padding-bottom: 30px;

  .order-header {
    height: @goods_header_height;
    flex-shrink: 0;
    padding: 0 20px;
  }

  .order-main {
    height: 0;
    flex: 1;
    box-sizing: border-box;
    border-top: 1px solid skyblue;
    border-bottom: 1px solid skyblue;
    // padding: 0 20px;
  }

  .el-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 10px 0;

    :deep(.el-pager li) {
      margin: 0 8px;
    }
    :deep(.el-pagination__jump) {
      margin-right: 16px;
    }
  }
}
</style>
