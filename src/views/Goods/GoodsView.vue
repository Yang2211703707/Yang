<!-- @format -->

<script setup lang="ts">
import { default as GoodsHeader } from '@/layout/Goods/GoodsHeader.vue';
import { default as GoodsMain } from '@/layout/Goods/GoodsMain.vue';

import { computed, ref } from 'vue';
import { useGoodsStore } from '@/stores/goods';

import type { mode } from '@/type/search';
import { storeToRefs } from 'pinia';

interface filterCategoryRules {
  text: string;
  value: string;
}

// header 相关
// 确定搜索值和筛选模式

const selectValue = ref<mode>('default-sort');
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
const filteredValue = ref<string[]>([]);
const { goodsList } = storeToRefs(useGoodsStore());
const datalist = computed(() => {
  let finalResult = goodsList.value;

  // 根据搜索模式确定数据的排列方式
  if (selectValue.value === 'reverse-sort')
    finalResult = finalResult.slice().reverse();

  if (filteredValue.value.length > 0)
    finalResult = finalResult.filter((item) =>
      filteredValue.value.includes(item.category)
    );

  // 根据搜索关键词匹配对应数据
  if (searchValue.value !== '')
    finalResult = finalResult.filter(
      (goods) =>
        goods.goodsCode.includes(searchValue.value) ||
        goods.name.includes(searchValue.value)
    );

  return finalResult;
});
const filterCategoryRules = computed(() => {
  let filterResult: filterCategoryRules[] = [];
  goodsList.value
    .reduce(
      (pre: string[], cur) =>
        pre.includes(cur.category) ? pre : pre.concat(cur.category),
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
const pageSize = ref(20);
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
  <div class="goods-pages">
    <goods-header
      v-model:searchValue="searchValue"
      v-model:selectValue="selectValue"
    ></goods-header>

    <goods-main
      :datalist="
        datalist.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      :filterCategoryRules="filterCategoryRules"
      @updateFilterRules="updateFilterRules"
    ></goods-main>

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

.goods-pages {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  //   padding-bottom: 30px;

  .goods-header {
    height: @goods_header_height;
    flex-shrink: 0;
    padding: 0 20px;
  }

  .goods-main {
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
