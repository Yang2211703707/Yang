<!-- @format -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';

const barChartRef = ref<HTMLElement | null>(null);
const goodsSalesTop_options = {
  title: {
    text: `商品销售排行`,
  },
  tooltip: {
    trigger: 'item',
    confine: true,
    formatter: '{a}<br/>单价：25 元<br/>{b} : {c} 包',
  },
  legend: {},
  xAxis: {
    data: [
      '芙蓉王',
      '老冰棍',
      '康师傅红烧牛肉面（桶）',
      '500ml统一阿萨姆奶茶（瓶）',
      '550ml怡宝矿泉水',
      '500ml百威啤酒（高罐）',
      '500ml珠江纯生啤酒（高罐）',
    ],
    axisLabel: {
      interval: 0, // 使 x 轴文字全显示
      formatter: (text: string) => {
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
      name: '商品名称',
      type: 'bar',
      data: [40, 34, 46, 35, 28, 60, 45],
    },
  ],
};

const pieChartRef = ref<HTMLElement | null>(null);
const todayTrading_ptions = {
  title: {
    text: `今日支付来源`,
  },
  tooltip: {
    trigger: 'item',
    confine: true,
    formatter: '{a} <br/>{b} : {c} 笔 ({d}%)',
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
};

const initECharts = (target: HTMLElement, option: any) => {
  const myChart = echarts.init(target);
  myChart.setOption(option);
};
onMounted(() => {
  initECharts(pieChartRef.value as HTMLElement, todayTrading_ptions);
  initECharts(barChartRef.value as HTMLElement, goodsSalesTop_options);
});
</script>

<template>
  <div class="statistics-page">
    <el-row :gutter="20" class="card">
      <el-col :span="6">
        <el-card shadow="hover"
          >今日营业额：￥<span class="number">3650.50</span> 元</el-card
        >
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover"
          >今日客流量：<span class="number">159</span> 人次</el-card
        >
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover"
          >平均消费金额：<span class="number">20</span> 元</el-card
        >
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover"
          >单笔最大金额：<span class="number">137</span> 元</el-card
        >
      </el-col>
    </el-row>

    <div class="charts">
      <div class="bar-chart" ref="barChartRef"></div>
      <div class="pie-chart" ref="pieChartRef"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '@/style/less/home.less';
@card_height: 150px;
@paddingTop: 20px;
@charts_height: calc(100vh - (@header_height + @card_height + @paddingTop));

.statistics-page {
  padding: @paddingTop 10px 0px;
  box-sizing: border-box;
  * > {
    box-sizing: border-box;
  }
  .card {
    width: 100%;
    margin: 0 !important;
    .el-card {
      height: @card_height;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      background-color: deepskyblue;
      .number {
        font-size: 20px;
        color: #e5e5e5;
      }
    }
  }
  .charts {
    width: 100%;
    height: @charts_height;
    display: flex;
    // box-sizing: border-box;
    padding-top: @paddingTop;
    .bar-chart {
      flex: 5;
      height: calc(@charts_height - @paddingTop);
      //   box-sizing: border-box;
      margin-right: 50px;
    }
    .pie-chart {
      flex: 2;
      height: calc(@charts_height - @paddingTop);
      //   box-sizing: border-box;
      margin-right: 50px;
    }
  }
}
</style>
