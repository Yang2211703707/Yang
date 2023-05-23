/** @format */

import { keepDecimal } from '@/utils/number';
import { computed, reactive } from 'vue';
import type { modifiedRes } from '../type/checkout';

export function useModifiedRes(originData: modifiedRes) {
  const modifiedRes: modifiedRes = reactive({
    name: originData.name,
    price: originData.price + '',
    count: Number(originData.count),
    discount: originData.discount + '',
  });
  const amount = computed((): number => {
    const price = Number(modifiedRes.price);
    const count = Number(modifiedRes.count);
    const discount = Number(modifiedRes.discount);
    return keepDecimal(price * count * (discount / 100));
  });

  return {
    modifiedRes,
    amount,
  };
}
