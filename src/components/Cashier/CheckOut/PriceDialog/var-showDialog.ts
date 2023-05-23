/** @format */

import { ref, watch } from 'vue';
import type { emit } from '../type/price-dialog';

export function useDialog(initState: boolean, emit: emit) {
  const showDialog = ref(initState || false);

  watch(showDialog, (newState) => {
    if (newState) emit('update:visible', true);
    else emit('update:visible', false);
  });

  return { showDialog };
}
