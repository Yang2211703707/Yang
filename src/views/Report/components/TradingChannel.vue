<!-- @format -->

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';

const barChartRef = ref<HTMLElement | null>(null);
const pieChartRef = ref<HTMLElement | null>(null);

const dailyOptions = {
  title: {
    text: `今日支付来源`,
  },
  tooltip: {
    trigger: 'item',
    confine: true,
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  series: [
    {
      name: '本日支付来源',
      type: 'pie',
      label: {
        show: true,
        position: 'inside',
        formatter: (obj: any) => obj.name + '\n\n' + obj.percent + '%',
      },
      data: [
        {
          name: '现金支付',
          value: 65,
        },
        {
          name: '微信支付',
          value: 48,
        },
        {
          name: '支付宝支付',
          value: 40,
        },
      ],
    },
  ],
  grid: {
    left: '3%',
    right: '26%',
    bottom: '3%',
    containLabel: true,
  },
};
const weeklyOptions = {
  title: {
    text: `本周支付来源`,
  },
  tooltip: {},
  legend: {},
  xAxis: {
    data: [
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
      '星期日',
    ],
    axisLabel: {
      interval: 0, // 使 x 轴文字全显示
      formatter: function (text: string) {
        let newText = '';
        const textLength = text.length;
        const provideNumber = 3; // 一行显示多少个字
        const rowNumber = Math.ceil(textLength / provideNumber);

        if (textLength > provideNumber) {
          for (let i = 0; i < rowNumber; i++) {
            const start = i * provideNumber;
            const end = start + provideNumber;
            const subStr =
              i === rowNumber - 1
                ? text.substring(start, textLength)
                : text.substring(start, end);
            newText = newText + subStr + '\n';
          }
        } else {
          newText = text;
        }

        return newText;
      },
    },
  },
  yAxis: {},
  series: [
    {
      name: '现金',
      type: 'bar',
      data: [40, 34, 46, 35, 28, 60, 45],
    },
    {
      name: '支付宝',
      type: 'bar',
      data: [23, 24, 18, 25, 27, 28, 25],
    },
    {
      name: '微信',
      type: 'bar',
      data: [26, 24, 18, 22, 23, 20, 27],
    },
  ],
};

const initECharts = (target: HTMLElement, option: any) => {
  const myChart = echarts.init(target);
  myChart.setOption(option);
};

onMounted(() => {
  console.log((barChartRef.value as HTMLElement).clientHeight);
  initECharts(pieChartRef.value as HTMLElement, dailyOptions);
  initECharts(barChartRef.value as HTMLElement, weeklyOptions);
});
</script>

<template>
  <section class="trading-channel-chart">
    <div class="bar-chart" ref="barChartRef"></div>
    <div class="pie-chart" ref="pieChartRef"></div>
  </section>
</template>

<style lang="less" scoped>
.trading-channel-chart {
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 20px;
  .bar-chart {
    flex: 5;
    height: 600px;
    box-sizing: border-box;
    margin-right: 50px;
  }
  .pie-chart {
    flex: 3;
    height: 600px;
    box-sizing: border-box;
    margin-right: 50px;
  }
}
</style>
