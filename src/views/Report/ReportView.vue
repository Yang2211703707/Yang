<!-- @format -->
<!-- 
    bug: 
    1. el-date-picker存在警告：[Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event. Consider marking event handler as 'passive' to make the page more responsive.
    解决方法：
        a. 使用 import 'default-passive-events' 的话，在切换到cashier页面时，由于设置了mousedown.passive，会影响到cashier页面。因此不采用
        b. 去组件内部修改源代码（还未修改）。参考方法：https://blog.csdn.net/qq_36350600/article/details/120339555

 -->

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onMounted,
  reactive,
  ref,
  shallowRef,
  watchEffect,
} from 'vue';

// import 'default-passive-events';

const dateValue = ref<Date[]>([]);
const date = new Date();
const defaultTime = [
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
];
onMounted(() => (dateValue.value = defaultTime));
watchEffect(() => {
  console.log(dateValue.value);
});

const mode = ref<string>('report-index');
const options = [
  {
    value: 'report-index',
    label: '默认页面',
  },
  {
    value: 'passenger-flow',
    label: '客流量',
  },
  {
    value: 'trading-channel',
    label: '支付渠道',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
];
const TradingChannel = defineAsyncComponent(
  () => import('./components/TradingChannel.vue')
);
const PassengerFlow = defineAsyncComponent(
  () => import('./components/PassengerFlow.vue')
);
const ReportIndex = defineAsyncComponent(
  () => import('./components/ReportIndex.vue')
);
interface currentComponent {
  [propName: string]: any;
}
const currentComponent: currentComponent = {
  'trading-channel': TradingChannel,
  'passenger-flow': PassengerFlow,
  'report-index': ReportIndex,
};
</script>

<template>
  <div class="report-page">
    <header class="header">
      <div class="picker">
        <!-- <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          start-placeholder="起始"
          end-placeholder="结束时间"
          range-separator="-"
          :default-time="defaultTime"
        /> -->
        <el-date-picker v-model="dateValue" type="datetimerange" />
      </div>

      <el-select v-model="mode" placeholder="请选择要查看的图表" size="large">
        <el-option
          v-for="{ value, label } in options"
          :key="value"
          :label="label"
          :value="value"
        />
      </el-select>
    </header>

    <component :is="currentComponent[mode]"></component>
  </div>
</template>

<style lang="less" scoped>
.report-page {
  .header {
    height: 50px;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .picker {
      width: 350px;
      .el-date-editor.el-input,
      .el-date-editor.el-input__wrapper {
        width: 350px;
      }
    }
  }
}
</style>
