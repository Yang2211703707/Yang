/** @format */

import { ElMessage } from 'element-plus';

import { nextTick, onMounted } from 'vue';

import type { Ref } from 'vue';
import type { inputRef, focusList, modifiedRes } from '../type/price-dialog';

type typeFormatPrice = (input: string, decimal?: number) => void;
type typeFormatCount = (input: number | string) => void;
type typeFormatDiscount = (input: string) => void;
type target = 'price' | 'count' | 'discount';

interface options {
  priceInputRef: Ref<inputRef | null>;
  countInputRef: Ref<inputRef | null>;
  discountInputRef: Ref<inputRef | null>;
  modifiedRes: modifiedRes;
  focusList: focusList[];
}

export function useHandleInputComp(options: options) {
  const {
    priceInputRef,
    countInputRef,
    discountInputRef,
    modifiedRes,
    focusList,
  } = options;

  function focusInput(target: target) {
    switch (target) {
      case 'price':
        if (priceInputRef.value) {
          priceInputRef.value.focus();
          priceInputRef.value.select();
        }
        break;
      case 'count':
        if (countInputRef.value) {
          countInputRef.value.focus();
        }
        break;
      case 'discount':
        if (discountInputRef.value) {
          discountInputRef.value.focus();
          discountInputRef.value.select();
        }
        break;

      default:
        console.log('PriceDialog 的 focusInput 函数中的 target 参数有误！');
        break;
    }
  }

  function formatPrice(input: string, decimal = 2) {
    console.log('formatPrice');
    const reg1 = new RegExp(`(\\d*\\.?\\d{0,${decimal}})([\\.\\d]*)`);
    modifiedRes.price = input.replace(/[^\d^\.]/g, '').replace(reg1, '$1');
  }
  function onPriceInput(input: string) {
    formatPrice(input);
    focusList[0].reset = false;
  }
  function onPriceInputFocus() {
    focusList[0].state = true;
    focusList[0].reset = true;
  }
  function onPriceInputBlur() {
    focusList[0].state = false;
    focusList[0].reset = false;
    const price = modifiedRes.price + '';

    if (/^\./.test(price)) modifiedRes.price = '0'.concat(price);

    if (Number(price) === 0 || Number.isNaN(Number(price)))
      modifiedRes.price = '0';
  }

  function formatCount(input: number | string) {
    modifiedRes.count = Number(input.toString().replace(/[^\d]/g, ''));
  }

  function formatDiscount(input: string) {
    modifiedRes.discount = input.replace(/[^\d]/g, '');
    if (Number(modifiedRes.discount) > 100) modifiedRes.discount = '100';
    if (Number(modifiedRes.discount) < 0) modifiedRes.discount = '0';
  }
  function onDiscountInput(input: string) {
    formatDiscount(input);
    focusList[2].reset = false;
  }
  function onDiscountInputFocus() {
    focusList[2].state = true;
    focusList[2].reset = true;
  }
  function onDiscountInputBlur() {
    focusList[2].state = false;
    focusList[2].reset = false;
    const discount = modifiedRes.discount + '';

    if (Number(discount) === 0 || Number.isNaN(Number(discount))) {
      modifiedRes.discount = '100';
      ElMessage({
        type: 'warning',
        message: '输入值不能为空或0！已重置为100！',
      });
    }
  }

  onMounted(async () => {
    await nextTick();
    focusInput('price');
  });

  return {
    focusInput,
    formatPrice,
    onPriceInput,
    onPriceInputFocus,
    onPriceInputBlur,
    formatCount,
    formatDiscount,
    onDiscountInput,
    onDiscountInputFocus,
    onDiscountInputBlur,
  };
}

export type { typeFormatPrice, typeFormatCount, typeFormatDiscount };
