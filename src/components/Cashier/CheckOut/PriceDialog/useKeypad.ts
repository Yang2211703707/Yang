/** @format */

import { ref } from 'vue';

import type { modifiedRes } from '../type/checkout';
import type { focusList } from '../type/price-dialog';
import type {
  typeFormatPrice,
  typeFormatCount,
  typeFormatDiscount,
} from './useInputComp';

interface options {
  focusList: focusList[];
  modifiedRes: modifiedRes;
  formatPrice: typeFormatPrice;
  formatCount: typeFormatCount;
  formatDiscount: typeFormatDiscount;
}

export function useKeypad(options: options) {
  const { focusList, modifiedRes, formatPrice, formatCount, formatDiscount } =
    options;

  const disableTargetList = ref([]);
  function handleNumKeypadInput(input: string) {
    console.log('handleNumKeypadInput', input);
    const findIndexRes = focusList.findIndex((item) => item.state);
    if (findIndexRes === -1) return;

    const target = focusList[findIndexRes].target;
    let str = modifiedRes[target] + input;

    if (target === 'price') {
      if (focusList[0].reset) {
        str = input;
        focusList[0].reset = false;
      }
      formatPrice(str);
    } else if (target === 'count') {
      if (focusList[1].reset) {
        str = input;
        focusList[1].reset = false;
      }
      formatCount(str);
    } else if (target === 'discount') {
      if (focusList[2].reset) {
        str = input;
        focusList[2].reset = false;
      }
      formatDiscount(str);
    }
  }
  function handleDelete() {
    const findIndexRes = focusList.findIndex((item) => item.state);
    if (findIndexRes === -1) return;

    const target = focusList[findIndexRes].target;
    const targetToStr = modifiedRes[target].toString();
    const subStr = targetToStr.substring(0, targetToStr.length - 1);

    if (target === 'count') modifiedRes[target] = Number(subStr);
    else modifiedRes[target] = subStr;
  }
  function handleClear() {
    const findIndexRes = focusList.findIndex((item) => item.state);
    if (findIndexRes === -1) return;

    const target = focusList[findIndexRes].target;
    if (target === 'count') modifiedRes[target] = 1;
    else if (target === 'price' || target === 'discount')
      modifiedRes[target] = '';
  }

  return {
    disableTargetList,
    handleNumKeypadInput,
    handleDelete,
    handleClear,
  };
}
