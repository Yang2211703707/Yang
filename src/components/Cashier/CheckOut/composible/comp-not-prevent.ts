/** @format */

import { usePageStateStore } from '@/stores/cashier-state';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';

export function useComponentNotPrevent() {
  const { cashier_preventDefault } = storeToRefs(usePageStateStore());

  onMounted(() => (cashier_preventDefault.value = false));
  onUnmounted(() => (cashier_preventDefault.value = true));
}
