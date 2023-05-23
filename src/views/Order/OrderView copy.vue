<!-- @format -->

<script setup lang="ts">
import { default as MyHeader } from '@/layout/Order/OrderHeader.vue';
import { default as MyMain } from '@/layout/Order/OrderMain.vue';

import { computed, reactive, ref, type Ref } from 'vue';
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia';

import type { orderItem } from '@/type/order';
import type { mode } from '@/type/search';

// goodsList的数据管理
const { orderList } = storeToRefs(useOrderStore());

// header 相关
// 确定搜索值和筛选模式
const selectValue = ref<mode>('order-sort');
const changeSelect = (mode: mode): void => {
  console.log('select value:', mode);
  selectValue.value = mode;
};
const searchValue = ref<string>('');
const changeSearch = (val: string): void => {
  console.log('search value:', val);
  searchValue.value = val;
};

// main 相关
// 根据筛选模式对源数据进行排序
const sortGoodsList = computed(() => {
  if (selectValue.value == 'reverse-sort')
    return orderList.value.slice().reverse();
  //   else if (selectValue.value == 'name-sort') return mapArr;
  else return orderList.value;
});
// 根据搜索值确定要展示的 经过排序的数据
const filterOrderList = computed(() => {
  if (searchValue.value == '') return sortGoodsList.value;

  return sortGoodsList.value.filter((item: orderItem) => {
    if (item.orderCode.includes(searchValue.value)) return item;
    if (item.payable.toString().includes(searchValue.value)) return item;
    if (item.payment.toString().includes(searchValue.value)) return item;
    //   else if (item.detail.name.includes(searchValue.value)) return item;
  });
});
// 要展示的 部分包含 搜索值的数据
const slicedOrderList = computed(() =>
  filterOrderList.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
);

// footer 相关
// orderList的分页配置
const currentPage = ref(1);
const pageSize = ref(50);
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
  <el-container class="goods-layout">
    <el-header>
      <my-header
        ref="header"
        @sendSearchValue="changeSearch"
        @sendSelectValue="changeSelect"
      ></my-header>
    </el-header>

    <el-main>
      <my-main :orderList="slicedOrderList"></my-main>
    </el-main>

    <el-footer>
      <el-pagination
        layout="sizes, prev, pager, next, jumper, total"
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :background="background"
        :total="filterOrderList.length"
        :pager-count="pagerCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-show="filterOrderList.length > 50"
      />
    </el-footer>
  </el-container>
</template>

<style lang="less" scoped>
@import '@/style/less/goods.less';

.goods-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  //   padding-bottom: 30px;

  .el-header {
    height: @goods_header_height;
    flex-shrink: 0;
  }

  .el-main {
    flex: 1;
    box-sizing: border-box;
    border-top: 1px solid skyblue;
    border-bottom: 1px solid skyblue;
    padding: 0 20px;
  }

  .el-footer {
    height: @goods_footer_height;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-pagination {
      :deep(.el-pager li) {
        margin: 0 8px;
      }
      :deep(.el-pagination__jump) {
        margin-right: 16px;
      }
    }
  }
}
</style>
