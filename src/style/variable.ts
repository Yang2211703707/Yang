/** @format */
/* 设置项目样式的全局变量 */

interface variable {
  [propName: string]: string;
}
// 字体变量
const baseSize: variable = {
  '--pc-font-size-large': '18px',
  '--pc-font-size-medium': '14px',
  '--pc-font-size-small': '12px',
};

// 主题一：浅色
export const lightTheme: variable = {
  '--pc-theme-color': '#2b2b2b',
  '--pc-header-bg': '#2b2b2b',
  '--pc-header-color': '#ccc',
  '--pc-aside-bg-color': '#15e64b',
  '--pc-aside-color': '#fff',
  ...baseSize,
};
// 主题二：深色
export const darkTheme: variable = {
  '--pc-theme-color': '#409eff',
  ...baseSize,
};
