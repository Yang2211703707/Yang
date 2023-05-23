/** @format */

import type { ElInput } from 'element-plus';

type inputRef = InstanceType<typeof ElInput>;
interface modifiedRes {
  name: string;
  price: string | number;
  count: string | number;
  discount: string | number;
}
interface emit {
  (e: 'update:visible', state: boolean): void;
  (e: 'confirmEvent', price: number, count: number, discount: number): void;
  (e: 'closeDialogEvent'): void;
}
interface focusList {
  target: 'price' | 'count' | 'discount';
  state: boolean;
  reset: boolean;
}

export type { inputRef, modifiedRes, emit, focusList };
