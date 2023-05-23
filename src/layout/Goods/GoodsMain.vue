<!-- @format -->

<script setup lang="ts">
import GoodsInfoModify from '@/components/Goods/GoodsInfoModify.vue';

import { ref, toRefs } from 'vue';
import { useGoodsStore } from '@/stores/goods';

import { isObjectValueEqual } from '@/utils/object';

import type { goodsItem } from '@/type/goods';

interface props {
  datalist: goodsItem[];
  filterCategoryRules: {
    text: string;
    value: string;
  }[];
}
interface emit {
  (e: 'updateFilterRules', rulesArr: string[]): void;
}

const props = defineProps<props>();
const { datalist, filterCategoryRules } = toRefs(props);

const filteredArray = ref<string[]>([]);
const emit = defineEmits<emit>();
const filterChangeHandle = (filters: { [prop: string]: string[] }) => {
  emit('updateFilterRules', filters['el-table_1_column_5']);
};

// 修改商品信息
const { changeGoodsInfo } = useGoodsStore();
const showGoodsDialog = ref(false);
const currentGoodsInfo = ref<goodsItem>({
  goodsCode: '0000',
  name: 'undefined',
  unit: 'undefined',
  category: 'undefined',
  cost: 0,
  price: 0,
  stock: 0,
  creatTime: new Date().getTime(),
});
const editorGoodsInfo = (e: any) => {
  console.log('scope的值为：', e, currentGoodsInfo.value, e.$index);
  showGoodsDialog.value = true;
  currentGoodsInfo.value = e.row;
};
const modifyToGoodsList = (modifiedRes: goodsItem) => {
  console.log(
    'modifyToGoodsList: ',
    modifiedRes,
    isObjectValueEqual(currentGoodsInfo.value, modifiedRes)
  );
  showGoodsDialog.value = false;
  if (!isObjectValueEqual(currentGoodsInfo.value, modifiedRes))
    changeGoodsInfo(modifiedRes);
};
const { delToGoodsList } = useGoodsStore();
const deleteGoods = (goodsCode: string) => {
  console.log('deleteGoods', goodsCode);
  showGoodsDialog.value = false;
  delToGoodsList(goodsCode);
};
</script>

<template>
  <div class="goods-main">
    <el-table
      :data="datalist"
      :default-sort="{ prop: 'goodsCode', order: 'ascending' }"
      style="width: 100%"
      highlight-current-row
      scrollbar-always-on
      stripe
      @filter-change="filterChangeHandle"
    >
      <el-table-column type="index" />

      <el-table-column
        prop="goodsCode"
        label="商品条码（货号）"
        min-width="250"
        show-overflow-tooltip
        sortable
      >
        <template #default="scope">
          <span class="goods-item-goodsCode">{{ scope.row.goodsCode }}</span>
          <el-button
            class="goods-item-goodsCode-button"
            @click="editorGoodsInfo(scope)"
            >编辑</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="商品名称"
        min-width="330"
        show-overflow-tooltip
      />
      <el-table-column
        prop="unit"
        label="规格"
        align="center"
        min-width="100"
      />
      <el-table-column
        prop="category"
        label="分类"
        align="center"
        min-width="100"
        :filters="filterCategoryRules"
        :filtered-value="filteredArray"
      />
      <el-table-column
        prop="price"
        label="售价"
        align="center"
        min-width="100"
        sortable
      />
      <el-table-column
        prop="cost"
        label="进货价"
        align="center"
        min-width="100"
      />
      <el-table-column
        prop="stock"
        label="库存"
        align="center"
        min-width="100"
      />
    </el-table>

    <GoodsInfoModify
      v-if="showGoodsDialog"
      :goods-info="currentGoodsInfo"
      :visible="showGoodsDialog"
      @close-dialog="showGoodsDialog = false"
      @confirm-event="modifyToGoodsList"
      @delete-goods="deleteGoods"
    ></GoodsInfoModify>
  </div>
</template>

<style lang="less" scoped>
@import '@/style/less/goods.less';

.goods-main {
  height: 100%;
  display: flex;
  flex-direction: column;

  .el-table {
    flex: 1;
    .goods-item-goodsCode {
      margin-right: 40px;
      &-button {
        // display: none;
        visibility: hidden;
      }
    }

    :deep(.el-table__row) {
      height: 40px;
      &:hover {
        & {
          height: 50px;
          //   font-size: 16px;
        }
        .goods-item-goodsCode-button {
          //   display: inline-flex;
          visibility: visible;
        }
      }
    }
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
</style>
