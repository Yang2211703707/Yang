<!-- @format -->

<script setup lang="ts">
import { computed, defineAsyncComponent, reactive, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePageStateStore } from '@/stores/cashier-state';

import { ElMessage } from 'element-plus';

interface tools {
  id: string;
  label: string;
  icon: string;
  component?: any;
  props: { [prop: string]: any };
}

const toolsList: Array<tools> = reactive([]);
function getToolsList() {
  const tempArr: Array<tools> = [
    {
      id: 'all-tools',
      label: '全部功能',
      icon: 'icon-quanbu',
      props: {},
    },
    {
      id: 'goods',
      label: '商品',
      icon: 'icon-shangpin',
      props: {},
    },
    {
      id: 'sales-sheet',
      label: '销售单据',
      icon: 'icon-dingdanguanli',
      props: {},
    },
    {
      id: 'return-goods',
      label: '商品退货',
      icon: 'icon-jiaoyiguanbi',
      props: {},
    },
    {
      id: 'add-goods',
      label: '新增商品',
      icon: 'icon-tianjia',
      component: shallowRef(
        defineAsyncComponent(
          () => import('@/components/Cashier/Tools/TheNewGoods.vue')
        )
      ),
      props: {},
    },
    {
      id: 'printer',
      label: '标签打印',
      icon: 'icon-jiaoyijilu',
      props: {},
    },
    {
      id: 'change-price',
      label: '快速调价',
      icon: 'icon-jiesuantongji',
      props: {},
    },

    {
      id: 'open-moneybox',
      label: '打开钱箱',
      icon: 'icon-jiezhang',
      props: {},
    },
    {
      id: 'daily-report',
      label: '每日报表',
      icon: 'icon-tongjifenxi-02',
      props: {},
    },
    {
      id: 'stock',
      label: '库存管理',
      icon: 'icon-kucunliang',
      props: {},
    },
    {
      id: 'sheet',
      label: '上传表单',
      icon: 'icon-paixu',
      props: {},
    },
  ];
  toolsList.push(...tempArr);
}

const router = useRouter();
const componentId = ref<string>('');
function toolsClickHandle(id: string): void {
  const index = toolsList.findIndex((item) => item.id === id);
  if (index === -1) ElMessage(`跳转目标异常！${id}`);
  else
    switch (id) {
      case 'all-tools':
        console.log('to all-tools');
        break;
      case 'goods':
        console.log('to goods');
        break;
      case 'sales-sheet':
        console.log('to sales-sheet');
        break;
      case 'return-goods':
        console.log('to return-goods');

        break;
      case 'add-goods':
        console.log('to add-goods');
        componentId.value = id;
        break;
      case 'printer':
        console.log('to printer');
        break;
      case 'change-price':
        console.log('to change-price');
        break;
      case 'open-moneybox':
        console.log('to open-moneybox');
        break;
      case 'daily-report':
        console.log('to daily-report');
        break;
      case 'stock':
        console.log('to stock');
        break;
      case 'sheet':
        console.log('to sheet');
        router.push('/tools/sheet');
        break;
      default:
        console.log('unknown path!');
        componentId.value = '';
        break;
    }
}

getToolsList();
</script>

<template>
  <div class="tools">
    <el-scrollbar>
      <div class="common-function">
        <div
          class="item"
          v-for="{ label, icon, id, component, props } in toolsList"
          :key="id"
          @click="toolsClickHandle(id)"
        >
          <el-icon><i class="iconfont" :class="icon"></i></el-icon>
          <p>{{ label }}</p>

          <template v-if="componentId === id">
            <component
              :is="component"
              @close="componentId = ''"
              v-bind="props"
            ></component>
          </template>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="less" scoped>
@import '@/style/less/cashier.less';

.common-function {
  //   .page-padding();
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: @common_footer_height;
  user-select: none;
  border-left: 1px solid var(--pc-color--yellow-1);

  .item {
    flex-shrink: 0;
    width: 100px;
    height: @common_footer_height;
    background: var(--pc-bg-color-white);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &:hover {
      background: var(--pc-bg-color-white-2);
    }

    .el-icon {
      margin-bottom: 5px;
    }
  }
}
</style>
