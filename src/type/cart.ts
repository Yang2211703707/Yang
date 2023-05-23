/** @format */

// cartItem {
//   goodsCode: 商品条码;
//   name: 商品名称;
//   cost: 商品进货价;
//   price: 商品原价;
//   count: 商品数量;
//   unit: 商品单位;
//   temp_price: 实际售价;
//   discount: 价格百分比
// }

interface baseCartItem {
  goodsCode: string;
  name: string;
  price: number;
  cost?: number;
  count?: number;
  unit?: string;
  temp_price?: number;
  discount?: number;
}

interface cartItem {
  goodsCode: string;
  name: string;
  cost: number;
  price: number;
  count: number;
  unit: string;
  temp_price: number;
  discount: number;
}

export type { baseCartItem, cartItem };
