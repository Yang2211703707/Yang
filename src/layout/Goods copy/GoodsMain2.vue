<!-- @format -->

<script setup lang="ts">
import {
  computed,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect,
  type Ref,
} from 'vue';

import type { goodsItem } from '@/type/goods';

const props = withDefaults(defineProps<{ goodsList: goodsItem[] }>(), {
  goodsList: () => [
    {
      goodsCode: `undefined`,
      name: `undefined`,
      unit: '未设置',
      category: '未设置',
      price: 0,
      cost: 0,
      stock: 0,
      creatTime: new Date().getTime(),
    },
  ],
});
const { goodsList } = toRefs(props);
const dataList = reactive(goodsList.value);
console.log(props, props.goodsList);
console.log(goodsList, goodsList.value, typeof goodsList);
console.log(dataList, typeof dataList);

const filterCategoryRules = ref<object>([]);
const filterCategory = (value: string, row: goodsItem): boolean => {
  //   console.log('filterCategory', value, row);
  return row.category === value;
  //   return row.category === value;
};
const updateDataList = (newArr: goodsItem[]) => {
  dataList.length = 0;
  dataList.push(...newArr);
};
watchEffect(() => {
  console.log(goodsList.value);
  //   updateDataList(goodsList.value);

  //   筛选出种类数组
  const reduceArr: Array<string> = goodsList.value.reduce(
    (res: Array<string>, curr) =>
      res.includes(curr.category) ? res : [...res, curr.category],
    []
  );
  console.log(reduceArr);
  //   组成filters需要的数组

  filterCategoryRules.value = reduceArr.map((item) => ({
    text: item,
    value: item,
  }));
  //   filterCategoryRules.value = reduceArr.reduce(
  //     (res: Array<{ text: string; value: string }>, curr) => [
  //       ...res,
  //       {
  //         text: curr,
  //         value: curr,
  //       },
  //     ],
  //     []
  //   );
  //   dataList.value = goodsList.value.filter((item) => {
  //     if (tempArr.includes(item.category as string)) return item;
  //   });
});

// footer 相关
// goodsList的分页配置
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

// 由于el-table的filter不能自定义filter规则，因此依靠改变dataList来实现自定义filter
const filteredArray = ref<string[]>([]);
const filterChangeHandle = (filtersObj: { [prop: string]: [] }) => {
  console.log('filterChangeHandle', filtersObj);

  const filters = filtersObj['el-table_1_column_5'] as string[];
  const filteredRes = goodsList.value.filter((item) => {
    if (filters.includes(item.category)) return item;
  });

  console.log('filteredRes: ', filteredRes, dataList, goodsList);
  dataList.length = 0;
  if (filters.length > 0) dataList.push(...filteredRes);
  else dataList.push(...goodsList.value);

  //   filteredArray.value = filtersObj['el-table_1_column_5'];
};
// watch(filteredArray, (newArr) => {
//   console.log(newArr);
//   const filteredRes = goodsList.value.filter((item) => {
//     if (newArr.includes(item.category)) return item;
//   });
//   console.log('filtered res: ', filteredRes);
// });
</script>
<!--
     :filtered-value="['雪糕', '香烟']"
     :filter-method="filterCategory"
 -->
<template>
  <div class="goods-main">
    <el-table
      :data="
        dataList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      :default-sort="{ prop: 'goodsCode', order: 'descending' }"
      style="width: 100%"
      highlight-current-row
      scrollbar-always-on
      stripe
      @filter-change="filterChangeHandle"
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goodsCode" label="商品条码（货号）" width="250" />
      <el-table-column prop="name" label="商品名称" width="330" />
      <el-table-column prop="unit" label="规格" align="center" />
      <el-table-column
        prop="category"
        label="分类"
        align="center"
        :filters="filterCategoryRules"
      />
      <el-table-column prop="price" label="售价" align="center" sortable />
      <el-table-column prop="cost" label="进货价" align="center" />
      <el-table-column prop="stock" label="库存" align="center" />
    </el-table>

    <el-pagination
      layout="sizes, prev, pager, next, jumper, total"
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :total="dataList.length"
      :background="background"
      :pager-count="pagerCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<!-- <template>
  <el-row class="header">
    <el-col :span="4"><div>商品条码（货号）</div></el-col>
    <el-col :span="8"><div>商品名称</div></el-col>
    <el-col :span="2"><div>规格</div></el-col>
    <el-col :span="2"><div>分类</div></el-col>
    <el-col :span="2"><div>数量</div></el-col>
    <el-col :span="2"><div>售价</div></el-col>
    <el-col :span="2"><div>进货价</div></el-col>
    <el-col :span="2"><div>库存</div></el-col>
  </el-row>

  <el-scrollbar class="goods-list">
    <el-row
      class="goods-item"
      v-for="{
        goodsCode,
        name,
        unit,
        category,
        price,
        cost,
        count,
        stock,
      } in goodsList"
      :key="goodsCode"
    >
      <el-col :span="4">
        <div>{{ goodsCode }}</div>
      </el-col>
      <el-col :span="8">
        <div>{{ name }}</div>
      </el-col>
      <el-col :span="2">
        <div>{{ unit }}</div>
      </el-col>
      <el-col :span="2">
        <div>{{ category }}</div>
      </el-col>
      <el-col :span="2">
        <div>{{ price }}</div>
      </el-col>
      <el-col :span="2">
        <div>{{ cost }}</div>
      </el-col>
      <el-col :span="2">
        <div>{{ count }}</div>
      </el-col>
      <el-col :span="2">
        <div>{{ stock }}</div>
      </el-col>
    </el-row>
  </el-scrollbar>
</template> -->

<style lang="less" scoped>
@import '@/style/less/goods.less';

.goods-main {
  height: 100%;
  display: flex;
  flex-direction: column;

  .el-table {
    flex: 1;
  }

  .el-pagination {
    flex-shrink: 0;
    height: @goods_footer_height;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;

    :deep(.el-pager li) {
      margin: 0 8px;
    }
    :deep(.el-pagination__jump) {
      margin-right: 16px;
    }
  }
}

// .header {
//   height: @goods_main_header_height;
//   line-height: @goods_main_header_height;
//   border-bottom: 1px solid skyblue;

//   .el-col {
//     text-align: center;
//   }
// }

// .el-table {
//   height: 100%;
//     height: @goods_main_goodslist_height;
// }

// #region
// .goods-list {
//   height: @goods_main_goodslist_height;

//   .goods-item {
//     height: @goods_main_goodslist_item_height;
//     box-sizing: border-box;
//     display: flex;
//     align-items: center;
//     text-align: center;
//     &:not(:last-child) {
//       border-bottom: 1px solid #ccc;
//     }
//   }
// }
// #endregion
</style>
