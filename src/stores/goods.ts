/** @format */

import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';

import type { goodsItem, baseGoodsItem } from '@/type/goods';

export const useGoodsStore = defineStore('goods', () => {
  // 初始化 goodsList
  let readGoodsList = localStorage.getItem('goodsList')
    ? JSON.parse(localStorage.getItem('goodsList') as string)
    : [];
  const goodsList: goodsItem[] = reactive(readGoodsList);
  goodsList.push({
    goodsCode: '6901028193498',
    name: '芙蓉王(硬)',
    unit: '盒',
    category: '香烟',
    price: 25,
    cost: 22.1,
    stock: 30,
    creatTime: new Date().getTime(),
  });
  watch(goodsList, (newValue) => {
    console.log('watch goodsList change...', newValue);
    localStorage.setItem('goodsList', JSON.stringify([...newValue]));
  });

  // for (let i = 1; i < 1000; i++) {
  //   goodsList.push({
  //     goodsCode: `000${i}`,
  //     name: `商品${i}`,
  //     unit: '未设置',
  //     category: '未设置',
  //     price: 0,
  //     cost: 0,
  //     stock: 0,
  //     creatTime: new Date().getTime(),
  //   });
  // }

  // 根据关键词查找对应商品，返回 <goodsItem>[]。 mode=0 模糊查找，mode=1 精确查找
  function checkGoods(checkValue: string, mode = 0): goodsItem[] {
    let result = goodsList.filter((item) => {
      if (mode === 0) {
        if (
          item.goodsCode.includes(checkValue) ||
          item.name.includes(checkValue)
        )
          return item;
      } else if (mode === 1) {
        if (item.goodsCode == checkValue) return item;
      } else console.log('checkGoods 的 mode 参数异常！');
    });

    return result;
  }

  // 根据传入数据生成一个 goodsItem 对象
  function goodsGenerator(options: baseGoodsItem): goodsItem {
    return {
      goodsCode: options.goodsCode,
      name: options.name,
      price: options.price,
      unit: options.unit as string | '个',
      category: options.category as string | '商品',
      cost: options.cost as number | 0,
      stock: options.stock as number | 0,
      creatTime: new Date().getTime(),
    };
  }

  // 添加商品到 goodsList
  function addToGoodsList(goodsInfo: goodsItem) {
    const findRes = goodsList.find(
      (goods) => goods.goodsCode == goodsInfo.goodsCode
    );
    findRes === undefined
      ? goodsList.push(goodsInfo)
      : ElMessage({
          message: '商品已存在！无需添加！',
          type: 'warning',
        });
  }

  // 删除 goodsList 中的指定对象
  function delToGoodsList(goodsCode: string) {
    const findIndexRes = goodsList.findIndex(
      (goods) => goods.goodsCode == goodsCode
    );
    if (findIndexRes >= 0) {
      const spliceRes = goodsList.splice(findIndexRes, 1);
      spliceRes.length > 0
        ? ElMessage({
            message: '删除成功！',
            type: 'success',
          })
        : ElMessage({
            message: '删除异常！索引有误',
            type: 'warning',
          });
    } else
      ElMessage({
        message: '商品列表中未找到要删除的商品！',
        type: 'warning',
      });
  }
  // 按商品码查找goodsList中的对应商品（可部分查找）
  function findToGoodsList(goodsCode: string, mode: number = 0): goodsItem[] {
    let result: goodsItem[] = [];
    if (mode === 0)
      result = goodsList.filter((goods) => goods.goodsCode.includes(goodsCode));
    else if (mode === 1)
      result = goodsList.filter((goods) => goods.goodsCode == goodsCode);
    return result;
  }

  // 存一下被修改前的原商品对象
  const goodsList_unmodify: goodsItem[] = reactive([]);
  // 改变 goodsList 中的商品
  function changeGoodsInfo(goodsInfo: goodsItem) {
    const findIndexRes = goodsList.findIndex(
      (goods) => goods.goodsCode == goodsInfo.goodsCode
    );
    if (findIndexRes >= 0) {
      console.log(
        'changeGoodsInfo 找到对应商品：',
        findIndexRes,
        goodsList[findIndexRes]
      );

      goodsList[findIndexRes] = {
        goodsCode: goodsInfo.goodsCode,
        name: goodsInfo.name,
        unit: goodsInfo.unit,
        category: goodsInfo.category,
        price: goodsInfo.price,
        cost: goodsInfo.cost,
        stock: goodsInfo.stock,
        creatTime: goodsInfo.creatTime,
      };
      goodsList_unmodify.push(goodsList[findIndexRes]);
    } else ElMessage('没有找到对应商品！');
  }

  function getOnlyGoodsCode(goodsCode: string): string {
    const findRes = findToGoodsList(goodsCode, 1);
    if (findRes.length > 0) return getOnlyGoodsCode(Number(goodsCode) + 1 + '');
    else return goodsCode + '';
  }
  function goodsCodeGenerator(): string {
    const readGoodsCode = localStorage.getItem('base-goods-code')
      ? JSON.parse(localStorage.getItem('base-goods-code') as string)
      : '1000';
    return getOnlyGoodsCode(readGoodsCode);
  }
  function isLegitGoodsCode(code: string) {
    return /^\d{4,16}$/.test(code);
  }

  return {
    goodsList,
    goodsList_unmodify,
    findToGoodsList,
    checkGoods,
    goodsGenerator,
    addToGoodsList,
    delToGoodsList,
    changeGoodsInfo,
    goodsCodeGenerator,
    isLegitGoodsCode,
  };
});
