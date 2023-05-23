/** @format */
import type { cartItem } from '@/type/cart';

// {
//   orderCode: 订单编号;
//   state: 订单状态;
//   trading: 交易渠道;
//   amount: 交易金额;
//   payable: 应付;
//   payment: 实付;
//   creatTime: 创建时间;
//   detail: 订单详情;
// }

interface orderItemDetail extends cartItem {}
type trading =
  | 'wechat'
  | 'alipay'
  | 'cash'
  | 'order'
  | 'wechat+cash'
  | 'alipay+cash'
  | 'order+cash';
interface orderItem {
  orderCode: string;
  state: 'success' | 'abnormal' | 'fail';
  type: 'sales' | 'return-goods';
  trading: trading;
  amount: number;
  payable: number;
  payment: number;
  createTime: number;
  detail: orderItemDetail[];
  receiveCash?: number;
}

export type { orderItem };
