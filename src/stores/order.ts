/** @format */

import { defineStore } from 'pinia';
import { reactive } from 'vue';

import type { orderItem } from '@/type/order';

export const useOrderStore = defineStore('order', () => {
  const orderList: orderItem[] = reactive([]);

  const orderCodeGenerator = () => {
    const time = new Date();
    const year = time.getFullYear().toString().substring(2);
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const count = (orderList.length + 1 + '').padStart(4, '0');

    // 生成 18 位订单编号
    return `000601${year}${month}${date}00${count}`;
  };

  for (let i = 0; i < 200; i++) {
    const obj: orderItem = {
      orderCode: orderCodeGenerator(),
      type: 'sales',
      state: 'success',
      trading: 'cash',
      amount: 251,
      payable: 251,
      payment: 250,
      createTime: new Date().getTime(),
      detail: [
        {
          goodsCode: (i + '').padStart(13, '0'),
          name: `goods${i + 1}`,
          price: 0.5 * i,
          cost: 0.36,
          count: 1,
          unit: '个',
          temp_price: 0.5 * i,
          discount: 100,
        },
        {
          goodsCode: (i + 1 + '').padStart(13, '0'),
          name: `goods${i + 1 + 1}`,
          price: 0.5 * i * 2,
          cost: 0.36,
          count: 1,
          unit: '个',
          temp_price: 0.5 * i * 2,
          discount: 100,
        },
      ],
    };
    if (i === 49) {
      obj.trading = 'alipay';
      for (let j = 0; j < 8; j++) {
        obj.detail.push({
          goodsCode: (i + 1 + '').padStart(13, '0'),
          name: `goods${i + 1 + 1}`,
          price: 0.5 * i * 2,
          cost: 0.36,
          count: 1,
          unit: '个',
          temp_price: 0.5 * i * 2,
          discount: 100,
        });
      }
    } else if (/[1-5]{2}/.test(i + '')) obj.trading = 'wechat+cash';
    orderList.push(obj);
  }

  return { orderList, orderCodeGenerator };
});
