/** @format */

// 保留value的n位小数
const keepDecimal = (value: number | string, n = 2): number =>
  Math.round(Number(value) * Math.pow(10, n)) / Math.pow(10, n);

export { keepDecimal };
