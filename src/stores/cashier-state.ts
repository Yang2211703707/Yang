/** @format */

// cashier_preventDefault: 控制在 cashier组件内，是否使用 preventDefault()

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePageStateStore = defineStore('page-state', () => {
  const cashier_preventDefault = ref(true);
  const showNewGoodsComp = ref(false);

  return { cashier_preventDefault, showNewGoodsComp };
});
