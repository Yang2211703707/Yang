/** @format */

import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';

import type { baseCartItem, cartItem } from '@/type/cart';
import { ElMessage } from 'element-plus';

import { keepDecimal } from '@/utils/number';

export const useCartStore = defineStore('cart', () => {
  // 初始化购物车
  const cart: cartItem[] = reactive([]);
  for (let i = 1; i <= 10; i++) {
    const item = {
      goodsCode: `000${i}`,
      name: `商品${i}`,
      cost: 1.56,
      price: 2,
      count: 1,
      unit: '个',
      temp_price: 2,
      discount: 100,
    };
    cart.push(item);
  }

  // 生成一个新的 cartItem 对象作为购物车里的商品
  function cartItemGenerator(options: baseCartItem): cartItem {
    return {
      goodsCode: options.goodsCode,
      name: options.name,
      price: options.price,
      cost: (options.cost as number) || 0,
      count: (options.count as number) || 1,
      unit: (options.unit as string) || '个',
      temp_price: options.price,
      discount: 100,
    };
  }

  // 增加商品到购物车
  function addToCart(goods: cartItem) {
    const findIndexRes = cart.findIndex(
      (item) => item.goodsCode == goods.goodsCode
    );
    findIndexRes === -1 ? cart.push(goods) : (cart[findIndexRes].count += 1);
    console.log('addToCart', goods, findIndexRes, cart);
  }

  // 从购物车删除指定商品
  function delToCart(goodsCode: string) {
    const findIndex = cart.findIndex((item) => item.goodsCode == goodsCode);
    findIndex !== -1
      ? cart.splice(findIndex, 1)
      : ElMessage({
          message: '要删除的对象不在购物车！',
          type: 'warning',
        });

    console.log('delToCart', goodsCode, findIndex, cart);
  }

  // 查找商品码对应商品是否已经在购物车中
  // const findToCart = computed(() => {
  //   const dataList = [...cart];
  //   return (goodsCode: string, mode: 'find' | 'findIndex' = 'find') => {
  //     let result: cartItem | {} | number;

  //     if (mode === 'find') {
  //       result = {};
  //       const findRes = dataList.find((item) =>
  //         item.goodsCode.includes(goodsCode)
  //       );
  //       if (findRes) result = findRes;
  //     } else {
  //       result = -1;
  //       const findIndexRes = dataList.findIndex((item) =>
  //         item.goodsCode.includes(goodsCode)
  //       );
  //       if (findIndexRes >= 0) result = findIndexRes;
  //     }

  //     return result;
  //   };
  // });
  function findToCart(goodsCode: string): cartItem[] {
    return cart.filter((item) => item.goodsCode == goodsCode);
  }

  // 购物车商品数量
  const itemCount = computed(() =>
    cart.reduce((prev, curr) => (prev += curr.count), 0)
  );
  // 购物车商品总价
  const cartAmount = computed(() => {
    const reduceRes = cart.reduce(
      (prev, curr) =>
        (prev = keepDecimal(prev + keepDecimal(curr.count * curr.temp_price))),
      0
    );
    return reduceRes.toFixed(2);
  });

  return {
    cart,
    itemCount,
    cartAmount,
    findToCart,
    cartItemGenerator,
    addToCart,
    delToCart,
  };
});
