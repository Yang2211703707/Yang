/** @format */

function sleep(interval = 1000) {
  return new Promise((res) => setTimeout(res, interval));
}

export { sleep };
