/** @format */

import type { cartItem } from '@/type/cart';

interface datalist extends cartItem {
  show_price_dialog: boolean;
}

interface modifiedRes {
  name: string;
  price: string | number;
  count: string | number;
  discount: string | number;
}

export type { datalist, modifiedRes };
