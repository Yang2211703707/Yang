<!-- @format -->

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const lineChartRef = ref<HTMLElement | null>(null);
const lineChartRef_options = {
  title: {
    text: 'Stacked Line',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
};
const dashboardRef_1 = ref<HTMLElement | null>(null);
const dashboard_1_options = {
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%',
  },
  series: [
    {
      name: '销售额',
      type: 'gauge',
      radius: '90%',
      max: 5000,
      progress: {
        show: true,
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
      },
      data: [
        {
          value: 3650.5,
          name: '销售额（元）',
        },
      ],
    },
  ],
};
const dashboardRef_2 = ref<HTMLElement | null>(null);
const dashboard_2_options = {
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%',
  },
  series: [
    {
      name: '客流量',
      type: 'gauge',
      radius: '90%',
      max: 500,
      progress: {
        show: true,
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
      },
      data: [
        {
          value: 215,
          name: '客流量（人次）',
        },
      ],
    },
  ],
};
const initECharts = (target: HTMLElement, option: any) => {
  const myChart = echarts.init(target);
  option && myChart.setOption(option);
};
onMounted(() => {
  initECharts(lineChartRef.value as HTMLElement, lineChartRef_options);
  initECharts(dashboardRef_1.value as HTMLElement, dashboard_1_options);
  initECharts(dashboardRef_2.value as HTMLElement, dashboard_2_options);
});
</script>

<template>
  <div class="report-index">
    <div class="left">
      <div class="line-chart" ref="lineChartRef"></div>
    </div>
    <div class="right">
      <div class="dashboard-1" ref="dashboardRef_1"></div>
      <div class="dashboard-2" ref="dashboardRef_2"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.report-index {
  display: flex;
  padding-top: 20px;
  height: 600px;

  .left {
    flex: 3;

    .line-chart {
      width: 100%;
      height: 100%;
      padding-top: 30px;
      box-sizing: border-box;
    }
  }

  .right {
    flex: 1;
    .dashboard-1,
    .dashboard-2 {
      width: 100%;
      height: 300px;
      padding-right: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
