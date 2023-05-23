/** @format */

let debounce_timer: null | ReturnType<typeof setTimeout> = null;
function debounce(func: Function, wait: number) {
  if (debounce_timer) clearTimeout(debounce_timer);
  debounce_timer = setTimeout(() => {
    func && func();
    debounce_timer = null;
  }, wait);
}
let throttle_timer: null | ReturnType<typeof setTimeout> = null;
function throttle(func: Function, wait: number) {
  if (!throttle_timer) {
    throttle_timer = setTimeout(() => {
      func && func();
      throttle_timer = null;
    }, wait);
  }
}

export { debounce, throttle };
