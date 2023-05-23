/** @format */

// goodsItem {
//   goodsCode: 商品条码;
//   name: 商品名字;
//   unit: 规格;
//   category: 种类;
//   cost: 进货价;
//   price: 售价;
//   stock: 库存;
//   creatTime: 创建时间;
// }

interface baseGoodsItem {
  goodsCode: string;
  name: string;
  price: number;
  unit?: string;
  category?: string;
  cost?: number;
  stock?: number;
  creatTime?: number;
}

interface goodsItem {
  goodsCode: string;
  name: string;
  unit: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  creatTime: number;
}

interface content_goodsItem {
  goodsCode: goodsItem['goodsCode'];
  name: string;
  price: number;
}

export type { baseGoodsItem, goodsItem };
