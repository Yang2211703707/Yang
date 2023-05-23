/** @format */

import { lightTheme, darkTheme } from './variable.js';
// import cssVars from 'css-vars-ponyfill';

let themeObj = localStorage.getItem('themeObj') || lightTheme;

export const setTheme = (themeName: string) => {
  let theme = themeName || 'light';
  switch (themeName) {
    case 'light':
      themeObj = lightTheme;
      break;
    case 'dark':
      themeObj = darkTheme;
      break;

    default:
      themeObj = lightTheme;
      break;
  }

  console.log('theme mode: ', theme, themeObj);
  for (const key in themeObj) {
    document.documentElement.style.setProperty(key, themeObj[key]);
  }

  // let variables;
  // switch (theme) {
  //   case 'light':
  //     variables = lightTheme;
  //     break;
  //   case 'dark':
  //     variables = darkTheme;
  //     break;

  //   default:
  //     variables = lightTheme;
  //     break;
  // }
  // cssVars({
  //   watch: true, // 当添加，删除或修改其<link>或<style>元素的禁用或href属性时，ponyfill将自行调用
  //   variables: variables, // variables 自定义属性名/值对的集合
  //   onlyLegacy: false, // false  默认将css变量编译为浏览器识别的css样式  true 当浏览器不支持css变量的时候将css变量编译为识别的css
  // });
};
