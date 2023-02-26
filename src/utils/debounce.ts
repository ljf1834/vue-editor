/**
 * @防抖
 * @param fn    待执行函数
 * @param wait  等待时间
 */
const debounce = (fn, wait) => {
  let timeout;

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, wait);

  }

}
export default debounce;