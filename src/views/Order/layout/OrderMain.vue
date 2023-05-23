<!-- @format -->

<script setup lang="ts">
import { reactive, ref, toRefs, watchEffect } from 'vue';

import { timestampToTime } from '@/utils/time';

import type { orderItem } from '@/type/order';

interface emit {
  (e: 'updateFilterRules', rulesArr: string[]): void;
}
interface props {
  datalist: orderItem[];
  filterRules1: {
    text: string;
    value: string;
  }[];
}

const props = defineProps<props>();

const { datalist, filterRules1 } = toRefs(props);
const tradingToText = (targetString: string) => {
  let text = '';
  switch (targetString) {
    case 'cash':
      text = '现金支付';
      break;
    case 'wechat':
      text = '微信支付';
      break;
    case 'alipay':
      text = '支付宝支付';
      break;
    case 'order':
      text = '其他网银渠道';
      break;
    case 'wechat+cash':
      text = '微信+现金';
      break;
    case 'alipay+cash':
      text = '支付宝+现金';
      break;
    case 'order+cash':
      text = '其他+现金';
      break;

    default:
      text = '未知渠道';
      break;
  }
  return text;
};
const formatCreateTime = (row: orderItem) => timestampToTime(row.createTime);
const formatType = (row: orderItem) => {
  let text = '';
  let currentVal = row.type;
  if (currentVal === 'sales') text = '销售单';
  else if (currentVal === 'return-goods') text = '退货单';
  return text;
};
const formatTrading = (row: orderItem) => tradingToText(row.trading);
const formatPayable = (row: orderItem) => row.payable + '元';
const formatPayment = (row: orderItem) => row.payment + '元';
const formatOrderState = (row: orderItem) => {
  let text = '';
  let currentVal = row.state;
  if (currentVal === 'success') text = '成功';
  else if (currentVal === 'abnormal') text = '异常';
  else if (currentVal === 'fail') text = '失败';
  return text;
};

const emit = defineEmits<emit>();
const handleFilterChange = (filters: { [prop: string]: string[] }) => {
  emit('updateFilterRules', filters['el-table_1_column_5']);
};

watchEffect(() => {
  filterRules1.value.forEach((item) => {
    item.text = tradingToText(item.text);
  });
});
</script>

<template>
  <el-table
    class="order-main"
    :data="datalist"
    :default-sort="{ prop: 'createTime', order: 'descending' }"
    style="width: 100%"
    fit
    highlight-current-row
    scrollbar-always-on
    @filter-change="handleFilterChange"
  >
    <el-table-column type="expand">
      <template #default="props">
        <div class="order-detail">
          <h1>订单详情</h1>
          <div class="container">
            <el-table class="item" :data="props.row.detail" border>
              <el-table-column
                prop="goodsCode"
                label="商品条码"
                min-width="300"
              />
              <el-table-column prop="name" label="商品名字" min-width="300" />
              <el-table-column prop="temp_price" label="售价" align="center" />
              <el-table-column prop="price" label="原价" align="center" />
              <el-table-column prop="cost" label="原价" align="center" />
              <el-table-column prop="count" label="数量" align="center" />
              <el-table-column prop="unit" label="种类" align="center" />
            </el-table>
          </div>
        </div>
      </template>
    </el-table-column>

    <el-table-column
      prop="orderCode"
      label="订单编号"
      min-width="200"
      align="center"
    />
    <el-table-column
      prop="createTime"
      label="创建时间"
      min-width="200"
      align="center"
      :formatter="formatCreateTime"
    />
    <el-table-column
      prop="type"
      min-width="100"
      label="订单类型"
      align="center"
      :formatter="formatType"
    />
    <el-table-column
      prop="trading"
      label="交易渠道"
      min-width="200"
      align="center"
      :formatter="formatTrading"
      :filters="filterRules1"
    />
    <el-table-column
      prop="payable"
      label="应付"
      min-width="100"
      align="center"
      :formatter="formatPayable"
    />
    <el-table-column
      prop="payment"
      label="实付"
      min-width="100"
      align="center"
      :formatter="formatPayment"
    />
    <el-table-column
      prop="state"
      label="订单状态"
      min-width="100"
      align="center"
      :formatter="formatOrderState"
    />
  </el-table>
</template>

<style lang="less" scoped>
// @import '@/style/less/order.less';

.order-main {
  height: 100%;
  :deep(.el-table__row) {
    height: 60px;
  }
}

.order-detail {
  padding: 20px 50px 40px;
  h1 {
    padding-left: 1%;
    padding-bottom: 10px;
    font-size: 18px;
  }
  .container {
    // height: 300px;
    .item {
      height: 100%;
      :deep(.el-table__row) {
        height: 40px;
      }
    }
  }
}
</style>
