<!-- @format -->

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const timesGenerator = () => {
  let timeArr = [];
  for (let i = 0; i < 24; i++) {
    let str = i > 9 ? i : '0' + i;
    timeArr.push(`${str}:00`);
  }
  timeArr.push('23:59');
  return timeArr;
};
const weeklyOptions = {
  title: {
    text: `客流量`,
  },
  tooltip: {},
  legend: {},
  xAxis: {
    data: timesGenerator(),
    // data: ['18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'],
  },
  yAxis: {},
  series: [
    {
      type: 'line',
      data: [10, 28],
      show: true,
      position: 'bottom',
      textStyle: {
        fontSize: 18,
      },
    },
  ],
};
const lineChartRef = ref<HTMLElement | null>(null);
const initECharts = (target: HTMLElement, option: any) => {
  const myChart = echarts.init(target);
  myChart.setOption(option);
};
onMounted(() => {
  initECharts(lineChartRef.value as HTMLElement, weeklyOptions);
});
</script>

<template>
  <section class="passenger-flow-chart">
    <div class="line-chart" ref="lineChartRef"></div>
  </section>
</template>

<style lang="less" scoped>
.passenger-flow-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 20px;
  .line-chart {
    width: 100%;
    height: 600px;
    box-sizing: border-box;
  }
}
</style>
